<template>
    <a-card>
        <div :class="advanced ? 'search' : null">
            <a-form layout="horizontal">
                <div :class="advanced ? null : 'fold'">
                    <a-row>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="内容" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-input v-model="form.content" style="width: 100%" placeholder="请输入" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="类别" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-select placeholder="请选择" v-model="form.contentType">
                                    <a-select-option :value="item.type" v-for="item in typeList" :key="item.type">{{
                                        item.label }}</a-select-option>
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
                <a-button v-if="permission.includes(1)" @click="addNew" type="primary">新建</a-button>
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

                    <a-popconfirm title="确定删除该工作?" ok-text="确定" cancel-text="取消" @confirm="delBlogContentList(record)"
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
            <WorkContentForm ref="WorkContentForm" :type="type" />
        </a-modal>
    </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import WorkContentForm from '@/pages/electrical/components/workContentForm'
import { getOperaList } from '@/services/backend'
import { mapGetters } from 'vuex'
import { getBlogContentList, delBlogContentList } from '@/services/electrical'

export default {
    name: 'workContent',
    components: { StandardTable, WorkContentForm },
    data() {
        return {
            modalTitle: "新增工作",
            advanced: true,
            visible: false,
            name: "",
            columns: [
                {
                    title: '序号',
                    dataIndex: 'id',
                    width: 50
                },
                {
                    title: '类型',
                    width: 100,
                    dataIndex: 'contentType',
                    customRender: (text) => {
                        let res = this.typeList.find(item => item.type == text)
                        if (res) {
                            return res.label
                        }
                    }
                },
                {
                    title: '内容',
                    dataIndex: 'content',
                    width: 400,
                },
                {
                    title: '操作',
                    width: 100,
                    scopedSlots: { customRender: 'action' }
                },

            ],
            typeList: [
                {
                    label: "电气柜",
                    type: 1
                },
                {
                    label: "现场安装",
                    type: 2
                },
                {
                    label: "售后",
                    type: 3
                }
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
            operaList: [],
            permission: []
        }
    },
    // authorize: {
    //     deleteRecord: 'delete'
    // },
    mounted() {
        this.init()
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
            console.log('aa');
            this.getData()
        },
        handleReset() {
            this.form = {

            }
            this.getData()
        },
        handleOk() {
            this.$nextTick(() => {
                this.$refs.WorkContentForm.handleSubmit(() => {
                    this.$message.success('保存成功', 3)
                    this.visible = false
                    this.getData()
                })
            })
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
            const res = await getBlogContentList({ pageSize, pageIndex, ...this.form })
            this.dataSource = res.data.data
        },
        async getOperaList() {
            const res = await getOperaList({})
            this.operaList = res.data.data
        },
        edit(data) {
            this.modalTitle = '编辑工作'
            this.visible = true
            this.type = 'edit'
            this.$nextTick(() => {
                this.$refs.WorkContentForm.getWorkTent(data)
            })
        },
        addNew() {
            this.type = 'add'
            this.modalTitle = '新增工作'
            this.visible = true
            this.$nextTick(() => {
                this.$refs.WorkContentForm.resetFields()
            })
        },
        async delBlogContentList(data) {
            const params = {
                id: data.id
            }
            let res = await delBlogContentList(params)
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