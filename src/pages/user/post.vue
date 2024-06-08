<template>
    <a-card>
        <div :class="advanced ? 'search' : null">
            <a-form layout="horizontal">
                <div :class="advanced ? null : 'fold'">
                    <a-row>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="职位名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 0 }">
                                <a-input v-model="form.roleName" placeholder="请输入" />
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
            <standard-table :columns="columns" :dataSource="dataSource" 
                :rowKey="'id'">
                <div slot="description" slot-scope="{text}">
                    {{ text }}
                </div>
                <div slot="action" slot-scope="{text, record}">
                    <a style="margin-right: 8px" @click="edit(record)"  v-if="permission.includes(3)">
                        <a-icon type="edit" />编辑
                    </a>

                    <a-popconfirm title="确定删除该职位?" ok-text="确定" cancel-text="取消" @confirm="delRoleInfo(record)"  v-if="permission.includes(2)">
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
import { mapGetters } from 'vuex'
import { getRoleList, delRoleInfo } from '@/services/user'
function formatDate(timestamp) {
    const date = new Date(timestamp); // 注意时间戳要乘以1000，因为JavaScript中的时间戳是以毫秒为单位的
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份从0开始，所以需要加1
    const day = date.getDate();
    return `${year}-${String(month).padStart(2, 0)}-${String(day).padStart(2, 0)}`;
}
export default {
    name: 'QueryList',
    components: { StandardTable, PostForm },
    data() {
        return {
            modalTitle: "新增职位",
            advanced: true,
            visible: false,
            columns: [
                {
                    title: '职位编号',
                    dataIndex: 'id',
                    width: 100
                },
                {
                    title: '职位名称',
                    dataIndex: 'roleName',
                    width: 100,
                },
                {
                    title: '职位描述',
                    dataIndex: 'description',
                    width: 100,
                },
                {
                    title: '创建时间',
                    width: 100,
                    dataIndex: 'createTime',
                    customRender: (text) => formatDate(text)
                },
                {
                    title: '更新时间',
                    width: 100,
                    dataIndex: "updateTime",
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
                pageIndex: 1,
                pageSize: 10,
                totalCount: 0
            },
            form: {
                roleName: undefined
            },
            roleList: [],
            deptList: [],
            permission: []
        }
    },
    // authorize: {
    //     deleteRecord: 'delete'
    // },
    mounted() {
        this.getData()
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
                this.$refs.postForm.handleSubmit(() => {
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
            this.pagination.pageIndex = page
            this.pagination.pageSize = pageSize
            this.getData()
        },
        // 获取列表
        getData() {
            let {pageIndex, pageSize} = this.pagination
            getRoleList({...this.form, pageIndex, pageSize}).then(res => {
                this.dataSource = res.data.data.records
                this.pagination.totalCount = res.data.data.totalCount
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
        async delRoleInfo(data) {
            const res = await delRoleInfo({ id: data.id })
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