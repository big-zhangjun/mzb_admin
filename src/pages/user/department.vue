<template>
    <a-card>
        <div :class="advanced ? 'search' : null">
            <a-form layout="horizontal">
                <div :class="advanced ? null : 'fold'">
                    <a-row>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="部门名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 0 }">
                                <a-input @pressEnter="handleSearch" v-model="form.deptName" placeholder="请输入" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 18, offset: 0 }">
                                <a-button style="margin-right: 18px;" @click="handleSearch">查询</a-button>
                                <a-button @click="addNew" type="primary" v-if="permission.includes(1)">新建</a-button>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </div>
            </a-form>
        </div>
        <div>
            <!-- <a-space class="operator">
                <a-button @click="addNew" type="primary">新建</a-button>
            </a-space> -->
            <standard-table :columns="columns" :dataSource="dataSource" :rowKey="'id'">
                <div slot="description" slot-scope="{text}">
                    {{ text }}
                </div>
                <div slot="action" slot-scope="{text, record}">
                    <a style="margin-right: 8px" @click="edit(record)">
                        <a-icon type="edit" v-if="permission.includes(3)" />编辑
                    </a>

                    <a-popconfirm title="确定删除该部门?" ok-text="确定" cancel-text="取消" @confirm="delDeptInfo(record)"
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
            <DeptForm ref="deptForm" :type="type" />
        </a-modal>
    </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import DeptForm from '@/pages/user/components/deptForm'
import { mapGetters } from 'vuex'
import { getDeptList, delDeptInfo, getRoleList } from '@/services/user'
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
    components: { StandardTable, DeptForm },
    data() {
        return {
            modalTitle: "新增部门",
            advanced: true,
            visible: false,
            columns: [
                {
                    title: '部门编号',
                    dataIndex: 'id',
                    width: 100
                },
                {
                    title: '部门名称',
                    dataIndex: 'deptName',
                    width: 100,
                },
                {
                    title: '部门描述',
                    dataIndex: 'description',
                    width: 100,
                },
                {
                    title: '部门负责人',
                    dataIndex: 'manager',
                    width: 100,
                },
                {
                    title: '创建时间',
                    width: 100,
                    dataIndex: 'createTime',
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
            selectedRows: [],
            pagination: {
                current: 1,
                pageSize: 10,
                totalCount: 0
            },
            form: {
                deptName: undefined
            },
            roleList: [],
            deptList: [],
            permission: []
        }
    },
    // authorize: {
    //     deleteRecord: 'delete'
    // },
    computed: {
        ...mapGetters('setting', ['menuData']),
    },
    mounted() {
        this.getData()
        this.permission = this.$route.meta.permission
    },
    watch: {
        menuData() {
            this.permission = this.$route.meta.permission
        }
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
                this.$refs.deptForm.handleSubmit(() => {
                    this.$message.success('保存成功', 3)
                    this.visible = false
                    this.getData()
                })
            })
        },
        handleCancel() {
            console.log('Clicked cancel button');
            this.visible = false;
        },
        onPageChange(page, pageSize) {
            this.pagination.current = page
            this.pagination.pageSize = pageSize
            this.getData()
        },
        // 获取列表
        getData() {
            const { pageSize, current } = this.pagination
            getDeptList({ pageSize, pageIndex: current,...this.form }).then(res => {
                this.dataSource = res.data.data.records
                // this.pagination.totalCount = totalCount
            })
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
            this.modalTitle = '编辑部门'
            this.visible = true
            this.type = 'edit'
            this.$nextTick(() => {
                this.$refs.deptForm.getDeptInfo(data.id)
            })
        },
        addNew() {
            this.type = 'add'
            this.modalTitle = '新增部门'
            this.visible = true
            this.$nextTick(() => {
                this.$refs.deptForm.resetFields()
            })
        },
        async delDeptInfo(data) {
            const res = await delDeptInfo({ id: data.id })
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