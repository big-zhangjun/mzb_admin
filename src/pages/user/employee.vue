<template>
    <a-card>
        <div :class="advanced ? 'search' : null">
            <a-form layout="horizontal">
                <div :class="advanced ? null : 'fold'">
                    <a-row>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="用户名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-input v-model="form.userName" style="width: 100%" placeholder="请输入" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="部门名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-select placeholder="请选择" v-model="form.deptID">
                                    <a-select-option :value="item.id" v-for="item in deptList" :key="item.id">{{
            item.deptName }}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="职位名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-select placeholder="请选择" v-model="form.roleID">
                                    <a-select-option :value="item.id" v-for="item in roleList" :key="item.id">{{
            item.roleName }}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row v-if="advanced">
                        <!-- <a-col :md="8" :sm="24">
                            <a-form-item label="真实姓名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-input placeholder="请输入" v-model="form.nickName"/>
                            </a-form-item>
                        </a-col> -->
                        <a-col :md="8" :sm="24">
                            <a-form-item label="在职离职" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-select placeholder="请选择" v-model="form.resign">
                                    <a-select-option :value="1">在职</a-select-option>
                                    <a-select-option :value="2">离职</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </div>
                <span style="float: right; margin-top: 3px;">
                    <a-button type="primary" @click="handleSearch">查询</a-button>
                    <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
                    <a @click="toggleAdvanced" style="margin-left: 8px">
                        {{ advanced ? '收起' : '展开' }}
                        <a-icon :type="advanced ? 'up' : 'down'" />
                    </a>
                </span>
            </a-form>
        </div>
        <div>
            <a-space class="operator">
                <a-button @click="addNew" type="primary">新建</a-button>
                <!-- <a-button>批量操作</a-button> -->
                <!-- <a-dropdown>
                    <a-menu @click="handleMenuClick" slot="overlay">
                        <a-menu-item key="delete">删除</a-menu-item>
                        <a-menu-item key="audit">审批</a-menu-item>
                    </a-menu>
                    <a-button>
                        更多操作 <a-icon type="down" />
                    </a-button>
                </a-dropdown> -->
            </a-space>
            <standard-table :columns="columns" :dataSource="dataSource" :rowKey="'id'" :scroll="{x: 1500}"
                :pagination="{ ...pagination, onChange: onPageChange }"
                @selectedRowChange="onSelectChange">
                <div slot="description" slot-scope="{text}">
                    {{ text }}
                </div>
                <div slot="action" slot-scope="{text, record}">
                    <a style="margin-right: 8px" @click="edit(record)">
                        <a-icon type="edit" />编辑
                    </a>

                    <a-popconfirm title="确定删除该员工?" ok-text="确定" cancel-text="取消" @confirm="deltUserInfo(record)">
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
            <UserForm ref="userForm" :type="type" />
        </a-modal>
    </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import UserForm from '@/pages/user/components/userForm'
// import { request } from '@/utils/request'
import { getUserList, deltUserInfo, getDeptList, getRoleList } from '@/services/user'
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    return formattedDate;
}

export default {
    name: 'QueryList',
    components: { StandardTable, UserForm },
    data() {
        return {
            modalTitle: "新增员工",
            advanced: true,
            visible: false,
            columns: [
                {
                    title: '员工编号',
                    dataIndex: 'id',
                    width: 150
                },
                {
                    title: '用户名',
                    dataIndex: 'userName',
                    width: 150,
                    scopedSlots: { customRender: 'description' }
                },
                {
                    title: '员工工号',
                    dataIndex: 'userNumber',
                    // sorter: true,
                    needtotalCount: true,
                    width: 150,
                    // customRender: (text) => text + ' 次'
                },
                // {
                //     dataIndex: 'status',
                //     needtotalCount: true,
                //     width: 150,
                //     slots: { title: 'statusTitle' }
                // },
                {
                    title: '真实姓名',
                    dataIndex: 'nickName',
                    width: 150,
                    sorter: true
                },
                {
                    title: '职位',
                    width: 150,
                    dataIndex: 'roleName',
                },
                {
                    title: '部门',
                    width: 150,
                    dataIndex: 'deptName',
                },
                {
                    title: '手机',
                    width: 150,
                    dataIndex: "mobile"
                },
                {
                    title: '性别',
                    width: 150,
                    dataIndex: "sex",
                    customRender: (text) => text ? '女' : '男'
                },
                {
                    title: '在职离职',
                    width: 150,
                    customRender: (text) => text == 1? '在职' : '离职',
                    dataIndex: "resign"
                },
                {
                    title: '创建时间',
                    width: 150,
                    dataIndex: "createTime",
                    customRender: (text) => formatDate(text)

                },
                {
                    title: '更新时间',
                    width: 150,
                    dataIndex: "updateTime",
                    customRender: (text) => formatDate(text)
                },
                {
                    title: '操作',
                    width: 150,
                    scopedSlots: { customRender: 'action' }
                },

            ],
            type: 'add',
            dataSource: [],
            selectedRows: [],
            pagination: {
                pageIndex: 1,
                pageSize: 10,
                totalCount: 0
            },
            form: {
                userName: "",
                nickName: "",
                roleID: undefined,
                deptID: undefined,
                resign: undefined
            },
            roleList: [],
            deptList: []
        }
    },
    // authorize: {
    //     deleteRecord: 'delete'
    // },
    mounted() {
        this.getData()
        this.initData()
    },
    methods: {
        handleSearch() {
            this.getData()
        },
        handleReset() {
            this.form = {
                userName: "",
                nickName: "",
                roleID: undefined,
                deptID: undefined,
                resign: undefined
            }
            this.getData()
        },
        handleOk() {
            this.$nextTick(() => {
                this.$refs.userForm.handleSubmit(() => {
                    this.$message.success('保存成功', 3)
                    this.visible = false
                    this.getData()
                })
            })
        },
        initData() {
            this.getDeptList()
            this.getRoleList()
        },
        handleCancel() {
            console.log('Clicked cancel button');
            this.visible = false;
        },
        onPageChange(page, pageSize) {
            this.pagination.pageIndex = page
            this.pagination.pageSize = pageSize
            this.getData()
        },
        // 获取列表
        getData() {
            const { pageSize, pageIndex } = this.pagination
            let params = {
                ...this.form
            }
            getUserList({ pageSize, pageIndex, ...params }).then(res => {
                const { records, totalCount } = res?.data?.data ?? {}
                this.dataSource = records
                this.pagination.totalCount = totalCount
            })
        },
        // 查询部门列表
        async getDeptList() {
            const res = await getDeptList({})
            if (res.data.status.retCode === 0) {
                this.deptList = res.data.data
            }
        },
        // 查询职位列表
        async getRoleList() {
            const res = await getRoleList({})
            if (res.data.status.retCode === 0) {
                this.roleList = res.data.data
            }
        },
        toggleAdvanced() {
            this.advanced = !this.advanced
        },
        remove() {
            this.dataSource = this.dataSource.filter(item => this.selectedRows.findIndex(row => row.key === item.key) === -1)
            this.selectedRows = []
        },
        onClear() {
            this.$message.info('您清空了勾选的所有行')
        },
        onStatusTitleClick() {
            this.$message.info('你点击了状态栏表头')
        },
        onChange() {
            this.$message.info('表格状态改变了')
        },
        onSelectChange() {
            this.$message.info('选中行改变了')
        },
        edit(data) {
            this.modalTitle = '编辑员工'
            this.visible = true
            this.type = 'edit'
            this.$nextTick(() => {
                this.$refs.userForm.getUserInfo(data.id)
            })
        },
        addNew() {
            this.type = 'add'
            this.modalTitle = '新增员工'
            this.visible = true
            this.$nextTick(()=> {
                this.$refs.userForm.resetFields()
            })
        },
        async deltUserInfo(data) {
            const res = await deltUserInfo({ id: data.id })
            if (res.data.status.retCode === 0) {
                this.$message.success("删除成功", 3)
                this.getData()
            } else {
                this.$message.warning(res.data.status.msg)
            }
        },
        handleMenuClick(e) {
            if (e.key === 'delete') {
                this.remove()
            }
        }
    }
}
</script>

<style lang="less" scoped>
.search {
    margin-bottom: 54px;
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