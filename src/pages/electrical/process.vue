<template>
    <a-card>
        <!-- <div :class="advanced ? 'search' : null">
            <a-form layout="horizontal">
                <div class="fold">
                    <a-row>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="内容" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 0 }">
                                <a-input v-model="form.deptName" placeholder="请输入" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item style="margin-top: -1px;" :labelCol="{ span: 3 }" :wrapperCol="{ span: 18, offset: 0 }">
                                <a-button style="margin-right: 18px;" @click="handleSearch">查询</a-button>
                                <a-button @click="addNew" type="primary">新建</a-button>
                            </a-form-item>
                        </a-col>
                    </a-row>

                </div>
            </a-form>
        </div> -->
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
                    <a style="margin-right: 8px" @click="edit(record)">
                        <a-icon type="edit" />编辑
                    </a>

                    <a-popconfirm title="确定删除该流程?" ok-text="确定" cancel-text="取消" @confirm="delFlowInfo(record)">
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
            <ProcessForm ref="ProcessForm" :type="type" />
        </a-modal>
    </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import ProcessForm from '@/pages/electrical/components/processForm'
import { getOperaList } from '@/services/backend'
import { getFlowList, delFlowInfo } from '@/services/electrical'

export default {
    name: 'workContent',
    components: { StandardTable, ProcessForm },
    data() {
        return {
            modalTitle: "新增流程",
            advanced: true,
            visible: false,
            name: "",
            columns: [
                {
                    title: '序号',
                    dataIndex: 'id',
                    width: 100
                },
                {
                    title: '姓名',
                    dataIndex: 'userName',
                    width: 100
                },
                {
                    title: '内容',
                    dataIndex: 'content',
                    width: 300,
                },
                {
                    title: '时间',
                    dataIndex: 'createTime',
                    width: 200,
                }
            ],
            type: 'add',
            dataSource: [],
            pagination: {
                pageIndex: 1,
                pageSize: 5,
                total: 0
            },
            form: {

            },
            clientList: [],
            operaList: []
        }
    },
    // authorize: {
    //     deleteRecord: 'delete'
    // },
    props: ["id"],
    mounted() {
        this.init()
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
                this.$refs.ProcessForm.handleSubmit(() => {
                    this.$message.success('保存成功', 3)
                    this.visible = false
                    this.getData()
                })
            })
        },
        init() {
            this.pagination = {
                pageIndex: 1,
                pageSize: 5,
                total: 0
            },
            this.getOperaList()
            this.getData()
        },
        onPageChange(page, pageSize) {
            this.pagination.pageIndex = page
            this.pagination.pageSize = pageSize
            this.getData()
        },
        // 获取列表
        async getData() {
            const { pageSize, pageIndex } = this.pagination
            const res = await getFlowList({ pageSize, pageIndex, projectID: +this.id })
            this.dataSource = res.data.data
        },
        async getOperaList() {
            const res = await getOperaList({})
            this.operaList = res.data.data
        },
        edit(data) {
            this.modalTitle = '编辑流程'
            this.visible = true
            this.type = 'edit'
            this.$nextTick(() => {
                this.$refs.ProcessForm.getWorkTent(data)
            })
        },
        addNew() {
            this.type = 'add'
            this.modalTitle = '新增流程'
            this.visible = true
            this.$nextTick(() => {
                this.$refs.ProcessForm.resetFields()
            })
        },
        async delFlowInfo(data) {
            const params = {
                id: data.id
            }
            let res = await delFlowInfo(params)
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