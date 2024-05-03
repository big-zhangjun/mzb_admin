<template>
    <a-card>
        <div :class="advanced ? 'search' : null">
            <a-form layout="horizontal">
                <div class="fold">
                    <a-row>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="产品名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-select :placeholder="'请选择产品名称'" v-model="form.productName">
                                    <a-select-option :value="item" v-for="item in productName" :key="item">{{ item
                                        }}</a-select-option>
                                </a-select>
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
            <standard-table :columns="columns" :dataSource="dataSource" :scroll="{ x: 2000 }"
                :pagination="{ ...pagination, onChange: onPageChange }" :rowKey="'id'">
                <div slot="description" slot-scope="{text}">
                    {{ text }}
                </div>
                
                <div slot="action" slot-scope="{text, record}">
                    <a style="margin-right: 8px" @click="edit(record)" v-if="permission.includes(3)">
                        <a-icon type="edit" />编辑
                    </a>
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
import { getProjectEpList, delProjectInfo } from '@/services/project'
import { mapGetters } from 'vuex'
function formatDate(timestamp) {
  if(timestamp == '1000-01-01') {
    return '--'
  }
  return timestamp
}
function getStatus(list, v) {
    let res = list.find(item=> item.id == v)
    if(res) {
        return res.label
    }
}
export default {
    name: 'QueryList',
    components: { StandardTable, PlanForm },
    data() {
        return {
            modalTitle: "新增项目",
            advanced: true,
            visible: false,
            productName: [
                "热压罐",
                "储气罐",
                "液压釜",
                "固化炉",
                "浸渍罐",
                "系统改造"
            ],
            statusList: [
                {
                    label: "未开始",
                    id: 1
                },
                {
                    label: "进行中",
                    id: 2
                },
                {
                    label: "缺料中",
                    id: 3
                },
                {
                    label: "已完成",
                    id: 4
                }
            ],
            columns: [
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
                    width: 150,
                },
                {
                    title: '型号',
                    width: 80,
                    dataIndex: 'model'
                },
                {
                    title: '电气柜负责人',
                    dataIndex: 'ecRepName',
                    width: 80,
                },
                {
                    title: '电气柜开始日期',
                    dataIndex: 'ecStartDate',
                    customRender: (text) => formatDate(text),
                    width: 80,
                },
                {
                    title: '电气柜结束日期',
                    dataIndex: 'ecEndDate',
                    customRender: (text) => formatDate(text),
                    width: 80,
                },
                {
                    title: '电气柜安装状态',
                    dataIndex: 'ecStatus',
                    customRender: (text) => getStatus(this.statusList, text),
                    width: 80,
                },
                {
                    title: '现场安装负责人',
                    dataIndex: 'siRepName',
                    width: 80,
                },
                {
                    title: '现场安装开始日期',
                    dataIndex: 'siStartTime',
                    customRender: (text) => formatDate(text),
                    width: 80,
                },
                {
                    title: '现场安装结束日期',
                    dataIndex: 'siEndTime',
                    customRender: (text) => formatDate(text),
                    width: 80,
                },
                {
                    title: '现场安装状态',
                    dataIndex: 'siStatus',
                    customRender: (text) => getStatus(this.statusList, text),
                    width: 80,
                },
                {
                    title: '操作',
                    width: 100,
                    fixed: 'right',
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
            const res = await getProjectEpList({ pageSize, pageIndex, ...this.form, status: 4 })
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
    width: calc(80% - 216px);
    display: inline-block
}

.operator {
    margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
    .fold {
        width: 80%;
    }
}
</style>