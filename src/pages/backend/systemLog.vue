<template>
    <a-card>
        <div :class="advanced ? 'search' : null">
            <a-form layout="horizontal">
                <div class="fold">
                    <a-row :gutter="16">
                        <a-col :md="6" :sm="24">
                            <a-form-item label="客户端" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-select placeholder="请选择" v-model="form.clientID" allowClear @clear="handleSearch">
                                    <a-select-option :value="item.id" v-for="item in clientList" :key="item.id">{{
                                        item.cn }}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="24">
                            <a-form-item label="部门" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 0 }">
                                <!-- <a-input v-model="form.deptName" placeholder="请输入" /> -->
                                <a-select placeholder="请选择" v-model="form.deptID" @change="handleDeptChange">
                                    <a-select-option :value="item.id" v-for="item in deptList" :key="item.id">{{
                                        item.deptName }}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="员工" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 0 }">
                                <!-- <a-input v-model="form.deptName" placeholder="请输入" /> -->
                                <a-select @change="handleSearch" :disabled="disabled" placeholder="请选择"
                                    v-model="form.userID">
                                    <a-select-option :value="item.id" v-for="item in userList" :key="item.id">{{
                                        item.userName }}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="操作类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-select placeholder="请选择" v-model="form.operateID" allowClear @clear="handleSearch">
                                    <a-select-option :value="item.id" v-for="item in operaList" :key="item.id">{{
                                        item.cn }}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="详细信息" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-input @pressEnter="handleSearch" v-model="form.detail" placeholder="请输入" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="时间范围" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-range-picker v-model="form.dateData" style="width: 100%;" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <span style="margin-top: 4px;display: block;">
                                <a-button type="primary" @click="handleSearch">查询</a-button>
                                <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
                            </span>
                        </a-col>
                    </a-row>

                </div>
            </a-form>
        </div>
        <div>
            <standard-table :columns="columns" :dataSource="dataSource"
                :pagination="{ ...pagination, onChange: onPageChange }" :rowKey="'id'">
                <div slot="description" slot-scope="{text}">
                    {{ text }}
                </div>
                <template slot="userName" slot-scope="{text, record}">
                    <div :title="record.userID">{{ text }}</div>
                </template>
                <div slot="action" slot-scope="{text, record}">
                    <a-popconfirm title="确定删除该日志?" ok-text="确定" cancel-text="取消" @confirm="delLogInfo(record)"
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
        <a-modal v-model="visible" :title="modalTitle" @ok="handleOk" :width="700">
            <PostForm ref="postForm" :type="type" />
        </a-modal>
    </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import PostForm from '@/pages/user/components/postForm'
import moment from 'moment';
import { mapGetters } from 'vuex'
import { getDeptListS, getUserList } from '@/services/user'

import { getClientList, getLogList, getOperaList, delLogInfo } from '@/services/backend'
function formatDate(isoString) {
    const date = new Date(isoString);

    // 获取年、月、日、小时、分钟、秒
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // 拼接成所需的格式
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDateTime;
}
export default {
    name: 'QueryList',
    components: { StandardTable, PostForm },
    data() {
        return {
            modalTitle: "新增职位",
            advanced: true,
            visible: false,
            userList: [],
            deptList: [],
            columns: [
                {
                    title: '序号',
                    dataIndex: 'id',
                    width: 40
                },
                {
                    title: '用户名',
                    dataIndex: 'userName',
                    width: 60,
                    scopedSlots: { customRender: 'userName' }

                },
                {
                    title: '客户端名称',
                    dataIndex: 'client',
                    width: 80,
                },
                {
                    title: '详情',
                    width: 200,
                    dataIndex: 'detail'
                },
                {
                    title: '操作类型',
                    width: 100,
                    dataIndex: 'operate'
                },
                {
                    title: '客户端IP',
                    width: 100,
                    dataIndex: 'clientIP'
                },
                {
                    title: '日志时间',
                    width: 100,
                    dataIndex: "createTime",
                    customRender: (text) => formatDate(text)
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
                current: 1,
                pageSize: 10,
                total: 0
            },
            form: {

            },
            permission: [],
            clientList: [],
            operaList: []
        }
    },
    // authorize: {
    //     deleteRecord: 'delete'
    // },
    mounted() {
        this.init()
        this.getData()
        this.getUserInfo()
        this.permission = this.$route.meta.permission
    },
    computed: {
        ...mapGetters('setting', ['menuData']),
    },
    watch: {
        menuData() {
            this.permission = this.$route.meta.permission
        }
    },
    activated() {
        this.getData()
    },
    methods: {
        async getUserInfo() {
            let deptRes = await getDeptListS({})
            this.deptList = deptRes.data.data
        },
        async handleDeptChange() {
            let userRes = await getUserList({ deptID: this.form.deptID, pageSize: 1000, pageIndex: 1 })
            this.form.userID = undefined
            this.userList = userRes.data.data.records
        },
        toggleAdvanced() {
            this.advanced = !this.advanced
        },
        handleSearch() {
            this.pagination.current = 1
            this.getData()
        },
        handleReset() {
            this.form = {

            }
            this.getData()
        },
        handleOk() {
            this.$nextTick(() => {
                this.$refs.postForm.handleSubmit(() => {
                    this.$message.success('保存成功', 3)
                    this.visible = false
                    this.getData()
                })
            })
        },
        init() {
            this.getClientList()
            this.getOperaList()
        },
        onPageChange(page, pageSize) {
            this.pagination.current = page
            this.pagination.pageSize = pageSize
            this.getData()
        },
        // 获取列表
        async getData() {
            const { pageSize, current } = this.pagination
            const { dateData, ...data } = this.form
            let endDate = ""
            let startDate = ""
            if (dateData) {
                startDate = moment(dateData[0]).format('YYYY-MM-DD')
                endDate = moment(dateData[1]).format('YYYY-MM-DD')
            }
            const res = await getLogList({ pageSize, pageIndex: current, ...data, startDate, endDate })
            this.dataSource = res.data.data.records
            this.pagination.total = res.data.data.totalCount
        },
        async getClientList() {
            const res = await getClientList({})
            this.clientList = res.data.data
        },
        async getOperaList() {
            const res = await getOperaList({})
            this.operaList = res.data.data
        },
        edit(data) {
            this.modalTitle = '编辑职位'
            this.visible = true
            this.type = 'edit'
            this.$nextTick(() => {
                this.$refs.postForm.getRoleInfo(data.id)
            })
        },
        addNew() {
            this.type = 'add'
            this.modalTitle = '新增职位'
            this.visible = true
            this.$nextTick(() => {
                this.$refs.postForm.resetFields()
            })
        },
        async delLogInfo(data) {
            const params = {
                id: data.id
            }
            let res = await delLogInfo(params)
            if (res.data.status.retCode == 0) {
                this.$message.success("操作成功")
            } else {
                this.$message.warning("操作失败")
            }
            this.getData()
        },
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