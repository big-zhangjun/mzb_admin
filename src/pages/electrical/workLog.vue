<template>
    <a-card>
        <div :class="advanced ? 'search' : null">
            <a-form layout="horizontal">
                <div class="fold">
                    <a-row :gutter="16">
                        <a-col :md="6" :sm="24">
                            <a-form-item label="部门" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 0 }">
                                <!-- <a-input v-model="form.deptName" placeholder="请输入" /> -->
                                <a-select :disabled="disabled" placeholder="请选择" v-model="form.deptID" @change="handleDeptChange">
                                    <a-select-option :value="item.id" v-for="item in deptList" :key="item.id">{{
                                        item.deptName }}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="员工" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 0 }">
                                <!-- <a-input v-model="form.deptName" placeholder="请输入" /> -->
                                <a-select :disabled="disabled" placeholder="请选择" v-model="form.userID">
                                    <a-select-option :value="item.id" v-for="item in userList" :key="item.id">{{
                                        item.userName }}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="客户名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 0 }">
                                <a-input v-model="form.customerName" placeholder="请输入" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="内容" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 0 }">
                                <a-input v-model="form.content" placeholder="请输入" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="时间范围" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 0 }">
                                <a-range-picker v-model="form.dateData" style="width: 100%;" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item style="margin-top: -1px;margin-left: 24px;" :labelCol="{ span: 3 }"
                                :wrapperCol="{ span: 18, offset: 0 }">
                                <a-button style="margin-right: 18px;" @click="handleSearch">查询</a-button>
                                <a-button @click="handleReset" type="primary">重置</a-button>
                            </a-form-item>
                        </a-col>
                    </a-row>

                </div>
            </a-form>
        </div>
        <div>
            <a-space class="operator">
                <a-button @click="addNew" type="primary" v-if="permission.includes(1)">新建</a-button>
                <a-button @click="exportFile" type="danger" v-if="permission.includes(5)">导出</a-button>
            </a-space>
            <standard-table :columns="columns" :dataSource="dataSource"
                :pagination="{ ...pagination, onChange: onPageChange }" :rowKey="'id'">
                <div slot="description" slot-scope="{text}">
                    {{ text }}
                </div>
                <div slot="action" slot-scope="{text, record}">
                    <a style="margin-right: 8px" @click="edit(record)" v-if="permission.includes(3)">
                        <a-icon type="edit" />编辑
                    </a>

                    <a-popconfirm title="确定删除该日志?" ok-text="确定" cancel-text="取消" @confirm="delBlogInfo(record)"
                        v-if="permission.includes(2)">
                        <a>
                            <a-icon type="delete" />删除
                        </a>
                    </a-popconfirm>
                </div>
                <template slot="statusTitle">
                    <a-icon @click.native="onStatusTitleClick" type="info-circle" />
                </template>
            </standard-table>
        </div>
        <a-modal v-model="visible" :title="modalTitle" @ok="handleOk" :width="800">
            <LogForm ref="LogForm" :type="type" />
        </a-modal>
    </a-card>
</template>

<script>
import moment from 'moment';
import StandardTable from '@/components/table/StandardTable'
import LogForm from '@/pages/electrical/components/logForm'
import { getOperaList } from '@/services/backend'
import { getBlogList, delBlogInfo } from '@/services/electrical'
import { getUserInfo, getDeptListS, getUserList } from '@/services/user'
import { mapGetters } from 'vuex'
export default {
    name: 'workContent',
    components: { StandardTable, LogForm },
    data() {
        return {
            modalTitle: "新增日志",
            advanced: true,
            visible: false,
            name: "",
            deptList: [],
            userList: [],
            columns: [
                {
                    title: '姓名',
                    dataIndex: 'userName',
                    width: 50,
                },
                {
                    title: '客户名称',
                    dataIndex: 'customerName',
                    width: 100,
                },
                {
                    title: '日期',
                    dataIndex: 'blogDate',
                    width: 100,
                },
                {
                    title: '内容',
                    dataIndex: 'content',
                    width: 100,
                },
                {
                    title: '地址',
                    dataIndex: 'address',
                    width: 100,
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    width: 100,
                },
                {
                    title: '操作',
                    width: 100,
                    scopedSlots: { customRender: 'action' }
                },

            ],
            type: 'add',
            dataSource: [],
            pagination: {
                pageIndex: 1,
                pageSize: 10,
                total: 0
            },
            form: {
                userID: undefined,
                deptID: undefined
            },
            disabled: false,
            clientList: [],
            operaList: [],
            permission: [],
            dataAuth: ""
        }
    },
    // authorize: {
    //     deleteRecord: 'delete'
    // },
    activated() {
        this.getUserInfo().then(() => {
            this.init()
            this.getData()
            this.permission = this.$route.meta.permission
        })
    },
    computed: {
        ...mapGetters('setting', ['menuData']),
    },
    watch: {
        menuData() {
            this.permission = this.$route.meta.permission
        }
    },
    methods: {
        async handleDeptChange()  {
            let userRes = await getUserList({ deptID: this.form.deptID, pageSize:1000, pageIndex: 1 })
            this.form.userID = undefined
            this.userList = userRes.data.data.records
        },
        async getUserInfo() {
            let id = JSON.parse(localStorage.getItem("admin.user")).id
            let res = await getUserInfo({ id })
            this.dataAuth = res.data.data.dataAuth
            let deptRes = await getDeptListS({})
            // let userRes = await getUserList({deptID:res.data.data.deptID })
            switch (this.dataAuth) {
                case 0:
                    this.deptList = deptRes.data.data
                    this.disabled = false
                    this.userList = []
                    this.form.deptID = undefined
                    this.form.userID = undefined
                    break;
                case 1:
                    this.deptList = deptRes.data.data.filter(item => item.id == res.data.data.deptID)
                    let userRess = await getUserList({ deptID: res.data.data.deptID, pageSize:1000, pageIndex: 1 })
                    this.userList = userRess.data.data.records
                    this.disabled = false
                    this.form.deptID = res.data.data.deptID
                    this.form.userID = res.data.data.id
                    break
                case 2:
                    this.deptList = deptRes.data.data.filter(item => item.id == res.data.data.deptID)
                    this.form.deptID = res.data.data.deptID
                    let userRes = await getUserList({ deptID: res.data.data.deptID, pageSize:1000, pageIndex: 1 })
                    this.userList = userRes.data.data.records
                    this.form.userID = res.data.data.id
                    this.disabled = true
                    break
                // this.userList = userRes.data.data
            }
            console.log(this.deptList);
        },
        toggleAdvanced() {
            this.advanced = !this.advanced
        },
        handleSearch() {
            this.getData()
        },
        handleReset() {
            this.form = {
                userID: undefined
            }
            this.getData()
        },
        handleOk() {
            this.$nextTick(() => {
                this.$refs.LogForm.handleSubmit(() => {
                    this.$message.success('保存成功', 3)
                    this.visible = false
                    this.getData()
                })
            })
        },
         // 导出
         async exportFile() {
            if (!window.showSaveFilePicker) {
                let file = await this.getFile('')
                let blob = await file.blob()
                const url = URL.createObjectURL(blob);
                // 创建一个<a>元素用于下载
                const a = document.createElement('a');
                // 设置href为Blob的URL
                a.href = url;
                // 设置下载的文件名，假设后端没有设置Content-Disposition头
                a.download = '电气项目计划表.xlsx'; // 你需要替换为实际的文件名和扩展名
                // 将<a>元素添加到文档中，并模拟点击它
                document.body.appendChild(a);
                a.click();

                // 清理
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                return
            }
            try {
                const opts = {
                    types: [
                        {
                            description: '文件',
                            accept: {
                                'text/plain': ['.xlsx'],
                            }
                        }
                    ],
                    excludeAcceptAllOption: true
                };

                const handle = await window.showSaveFilePicker(opts); // 打开保存文件对话框
                const writable = await handle.createWritable(); // 创建可写入的文件对象
                // 在这里写入文件内容
                let file = await this.getFile(handle.name)
                let blob = await file.blob()
                await writable.write(blob);
                await writable.close();

                this.$message.success('文件保存成功')
            } catch (error) {
                // this.$message.warning('文件保存失败')
                console.error('文件保存失败:', error);
            }
        },
        async getFile(remark) {
            const { pageSize, pageIndex } = this.pagination
            const { deptID, userID, dateData } = this.form    
            let endDate = ""
            let startDate = ""
            if (dateData) {
                startDate = moment(dateData[0]).format('YYYY-MM-DD')
                endDate = moment(dateData[1]).format('YYYY-MM-DD')
            }
            let params = {
                pageSize, pageIndex, userID, deptID, endDate, startDate,remark
            }
            const API_PROXY_PREFIX = '/api'
            const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
            let user = JSON.parse(localStorage.getItem("userKey"))
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'app-sig': user.sig,
                    'app-ts': user.ts,
                    'app-id': `${user.id}`
                },
                body: JSON.stringify(params)
            };

            return await fetch(BASE_URL + '/blog/export_blog_list', options)

        },
        init() {
            this.getOperaList()
        },
        onPageChange(page, pageSize) {
            this.pagination.pageIndex = page
            this.pagination.pageSize = pageSize
            this.getData()
        },
        // 获取列表
        async getData() {
            const { pageSize, pageIndex } = this.pagination
            const { deptID, userID, dateData,...p } = this.form    
            let endDate = ""
            let startDate = ""
            if (dateData) {
                startDate = moment(dateData[0]).format('YYYY-MM-DD')
                endDate = moment(dateData[1]).format('YYYY-MM-DD')
            }
            const res = await getBlogList({ pageSize, pageIndex, userID, deptID, endDate, startDate, ...p })
            this.dataSource = res.data.data.records
            this.pagination.total = res.data.data.totalCount
        },
        async getOperaList() {
            const res = await getOperaList({})
            this.operaList = res.data.data
        },
        edit(data) {
            this.modalTitle = '编辑日志'
            this.visible = true
            this.type = 'edit'
            this.$nextTick(() => {
                this.$refs.LogForm.getWorkTent(data)
            })
        },
        addNew() {
            this.type = 'add'
            this.modalTitle = '新增日志'
            this.visible = true
            this.$nextTick(() => {
                this.$refs.LogForm.resetFields()
            })
        },
        async delBlogInfo(data) {
            const params = {
                id: data.id
            }
            let res = await delBlogInfo(params)
            if (res.data.status.retCode == 0) {
                this.$message.success("操作成功")
            } else {
                this.$message.warning("操作失败")
            }
            this.getData()
        }
    }
}
</script>

<style lang="less" scoped>
.search {
    // margin-bottom: 24px;
}

.fold {
    width: calc(100% - 216px);
    display: inline-block
}

.operator {
    margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
    .fold {
        width: 100%;
    }
}
</style>