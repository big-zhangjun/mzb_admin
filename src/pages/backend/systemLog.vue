<template>
    <a-card>
        <div :class="advanced ? 'search' : null">
            <a-form layout="horizontal">
                <div class="fold">
                    <a-row>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="客户端" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-select placeholder="请选择" v-model="form.clientID" allowClear @clear="handleSearch">
                                    <a-select-option :value="item.id" v-for="item in clientList" :key="item.id">{{ item.cn }}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="操作类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-select placeholder="请选择" v-model="form.operateID" allowClear @clear="handleSearch">
                                    <a-select-option :value="item.id" v-for="item in operaList" :key="item.id">{{ item.cn }}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>

                    </a-row>
                    <span style="margin-top: 3px;">
                        <a-button type="primary" @click="handleSearch">查询</a-button>
                        <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
                    </span>
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
                    <a style="margin-right: 8px" @click="edit(record)">
                        <a-icon type="edit" />编辑
                    </a>

                    <a-popconfirm title="确定删除该职位?" ok-text="确定" cancel-text="取消" @confirm="delRoleInfo(record)">
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
import { getClientList, getLogList, getOperaList } from '@/services/backend'
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000); // 注意时间戳要乘以1000，因为JavaScript中的时间戳是以毫秒为单位的
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
                    title: '序号',
                    dataIndex: 'id',
                    width: 100
                },
                {
                    title: '用户名',
                    dataIndex: 'userName',
                    width: 100,
                },
                {
                    title: '客户端名称',
                    dataIndex: 'client',
                    width: 100,
                },
                {
                    title: '详情',
                    width: 100,
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
                pageIndex: 1,
                pageSize: 10,
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
    mounted() {
        this.init()
        this.getData()
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
            this.pagination.pageIndex = page
            this.pagination.pageSize = pageSize
            this.getData()
        },
        // 获取列表
        async getData() {
            const { pageSize, pageIndex } = this.pagination
            const res = await getLogList({ pageSize, pageIndex, ...this.form })
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