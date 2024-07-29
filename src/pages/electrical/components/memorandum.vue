<template>
    <a-card>
        <div>
            <standard-table :columns="columns" :dataSource="dataSource"
                :pagination="{ ...pagination, onChange: onPageChange }" :rowKey="'id'">
                <div slot="action" slot-scope="{text, record}">
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
    </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import ProcessForm from '@/pages/electrical/components/processForm'
import { getOperaList } from '@/services/backend'
import { getMemoList, delFlowInfo } from '@/services/electrical'

export default {
    name: 'workContent',
    components: { StandardTable, ProcessForm },
    data() {
        return {
            modalTitle: "新增流程",
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
        }
    },
    // authorize: {
    //     deleteRecord: 'delete'
    // },
    props: {
        id: {},
        flowType: {
            default: 1
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.pagination = {
                pageIndex: 1,
                pageSize: 5,
                total: 0
            },
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
            const res = await getMemoList({ pageSize, pageIndex, projectID: +this.id })
            this.dataSource = res.data.data.records
            this.pagination.total = res.data.data.totalCount
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