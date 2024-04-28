<template>
    <a-card>
        <div :class="advanced ? 'search' : null">
            <a-form layout="horizontal">
                <div class="fold">
                    <a-row>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="产品名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-input v-model="form.productName" placeholder="请输入" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="客户名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-input v-model="form.customerName" placeholder="请输入" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item :labelCol="{ span: 3 }" style="margin-top: -1px;margin-left: 18px;"
                                :wrapperCol="{ span: 18, offset: 0 }">
                                <a-button style="margin-right: 18px;" @click="handleSearch">查询</a-button>
                                <a-button @click="handleReset">重置</a-button>
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
                :pagination="{ ...pagination, onChange: onPageChange }" :rowKey="'id'">
                <div slot="description" slot-scope="{text}">
                    {{ text }}
                </div>
                <div slot="action" slot-scope="{text, record}">
                    <a style="margin-right: 8px" @click="edit(record)" v-if="permission.includes(3)">
                        <a-icon type="edit" />编辑
                    </a>

                    <a-popconfirm title="确定删除该项目?" ok-text="确定" cancel-text="取消" @confirm="delProjectInfo(record)"  v-if="permission.includes(2)">
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
            <PlanForm ref="PlanForm" :type="type" />
        </a-modal>
    </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import PlanForm from '@/pages/electrical/components/planForm'
import { getProjectList, delProjectInfo } from '@/services/project'
import { mapGetters } from 'vuex'
// function formatDate(timestamp) {
//   const date = new Date(timestamp * 1000); // 注意时间戳要乘以1000，因为JavaScript中的时间戳是以毫秒为单位的
//   const year = date.getFullYear();
//   const month = date.getMonth() + 1; // 月份从0开始，所以需要加1
//   const day = date.getDate();
//   return `${year}-${String(month).padStart(2, 0)}-${String(day).padStart(2, 0)}`;
// }
export default {
    name: 'QueryList',
    components: { StandardTable, PlanForm },
    data() {
        return {
            modalTitle: "新增项目",
            advanced: true,
            visible: false,
            columns: [
                {
                    title: '项目编号',
                    dataIndex: 'number',
                    width: 50
                },
                {
                    title: '产品编号',
                    dataIndex: 'productNumber',
                    width: 50,
                },
                {
                    title: '产品名称',
                    dataIndex: 'productName',
                    width: 50
                },
                {
                    title: '客户名称',
                    dataIndex: 'customerName',
                    width: 300,
                },
                {
                    title: '型号',
                    width: 100,
                    dataIndex: 'model'
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
                "number": "",
                "productNumber": "",
                "customerName": "",
                "productName": "",
                "level": 0,
                "pageSize": 10,
                "pageIndex": 1
            },
            clientList: [],
            operaList: [],
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
        toggleAdvanced() {
            this.advanced = !this.advanced
        },

        handleSearch() {
            this.getData()
        },
        handleReset() {
            this.form = {

            }
            this.getData()
        },
        handleOk() {
            this.$nextTick(() => {
                this.$message.success('保存成功', 3)
                this.visible = false
            })
        },
        onPageChange(page, pageSize) {
            this.pagination.pageIndex = page
            this.pagination.pageSize = pageSize
            this.getData()
        },
        // 获取列表
        async getData() {
            const { pageSize, pageIndex } = this.pagination
            const res = await getProjectList({ pageSize, pageIndex, ...this.form })
            this.dataSource = res.data.data.records
            this.pagination.total = res.data.data.totalCount
        },
        edit(data) {
            this.modalTitle = '编辑项目'
            this.visible = true
            this.type = 'edit'
            this.$nextTick(() => {
                this.$refs.PlanForm.getProjectInfo(data.id)
            })
        },
        async delProjectInfo(data) {
            const params = {
                id: data.id
            }
            let res = await delProjectInfo(params)
            if (res.data.status.retCode == 0) {
                this.$message.success("操作成功")
            } else {
                this.$message.warning("操作失败")
            }
            this.getData()
        },
        addNew() {
            this.type = 'add'
            this.modalTitle = '新增项目'
            this.visible = true
            this.$nextTick(() => {
                this.$refs.PlanForm.resetFields()
            })
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