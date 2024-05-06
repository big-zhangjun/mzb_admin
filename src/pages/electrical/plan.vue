<template>
    <a-card class="plan">
        <div :class="advanced ? 'search' : null">
            <a-form layout="horizontal">
                <div :class="advanced ? null : 'fold'">
                    <a-row>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="产品名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-select :placeholder="'请选择产品名称'" v-model="form.productName">
                                    <a-select-option :value="item" v-for="item in productName" :key="item">{{ item
                                        }}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="客户名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-input v-model="form.customerName" placeholder="请输入" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="时间范围" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-range-picker v-model="form.dateData" style="width: 100%;" />
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
        <a-space class="operator">
            <a-button @click="exportFile" type="primary" v-if="permission.includes(5)">导出</a-button>

        </a-space>
        <div class="scrollList" v-infinite-scroll="handleInfiniteOnLoad" :infinite-scroll-disabled="true"
            :infinite-scroll-distance="100">
            <a-empty v-if="!dataSource.length"/>
            <div v-for="item in dataSource" :key="item.id" style="margin-bottom: 25px;">
                <a-card hoverable type="inner" :loading="loading" :title="item.customerName">
                    <a slot="extra" href="#">P{{ item.level }}</a>
                    <a-descriptions>
                        <a-descriptions-item label="产品名称">
                            <div class="item">
                                <div class="label">
                                    {{ item.productName }}
                                </div>
                            </div>
                        </a-descriptions-item>
                        <a-descriptions-item label="产品编号">
                            <div class="item">
                                <div class="label">
                                    {{ item.productNumber || '--' }}
                                </div>
                            </div>
                        </a-descriptions-item>
                        <a-descriptions-item label="型号">
                            <div class="item">
                                <div class="label">
                                    {{ item.model || '--' }}
                                </div>
                            </div>
                        </a-descriptions-item>
                        <a-descriptions-item label="电气柜负责人">
                            <div class="item">
                                <div class="label">
                                    {{ item.ecRepName || '--' }}
                                </div>
                                <span @click="handleEdit(item, 'ecRep')">修改</span>
                            </div>
                        </a-descriptions-item>
                        <a-descriptions-item label="电气柜开始日期">
                            <div class="item">
                                <div class="label">
                                    {{ item.ecStartDate || '--' }}
                                </div>
                                <span @click="handleEdit(item, 'ecStartDate')">修改</span>
                            </div>
                        </a-descriptions-item>
                        <a-descriptions-item label="电气柜结束日期">
                            <div class="item">
                                <div class="label">
                                    {{ item.ecEndDate || '--' }}
                                </div>
                                <span @click="handleEdit(item, 'ecEndDate')">修改</span>
                            </div>
                        </a-descriptions-item>
                        <a-descriptions-item label="电气柜安装状态">
                            <div class="item">
                                <div class="label">
                                    {{ getStatus(item.ecStatus) || '--' }}
                                </div>
                                <span @click="handleEdit(item, 'ecStatus')">修改</span>
                            </div>
                        </a-descriptions-item>
                        <a-descriptions-item label="电气柜清单">
                            <div class="item">
                                <div class="label">
                                    {{ getListStatus(item.electricalList) || '--' }}
                                </div>
                                <span @click="handleEdit(item, 'electricalList')">修改</span>
                            </div>
                        </a-descriptions-item>
                        <a-descriptions-item label="现场安装负责人">
                            <div class="item">
                                <div class="label">
                                    {{ item.siRepName || '--' }}
                                </div>
                                <span @click="handleEdit(item, 'siRep')">修改</span>
                            </div>
                        </a-descriptions-item>
                        <a-descriptions-item label="现场安装开始日期">
                            <div class="item">
                                <div class="label">
                                    {{ item.siStartTime || '--' }}
                                </div>
                                <span @click="handleEdit(item, 'siStartTime')">修改</span>
                            </div>
                        </a-descriptions-item>
                        <a-descriptions-item label="现场安装结束日期">
                            <div class="item">
                                <div class="label">
                                    {{ item.siEndTime || '--' }}
                                </div>
                                <span @click="handleEdit(item, 'siEndTime')">修改</span>
                            </div>
                        </a-descriptions-item>
                        <a-descriptions-item label="现场安装状态">
                            <div class="item">
                                <div class="label">
                                    {{ getStatus(item.siStatus) || '--' }}
                                </div>
                                <span @click="handleEdit(item, 'siStatus')">修改</span>
                            </div>
                        </a-descriptions-item>
                        <a-descriptions-item label="现场安装清单">
                            <div class="item">
                                <div class="label">
                                    {{ getListStatus(item.invoiceList) || '--' }}
                                </div>
                                <span @click="handleEdit(item, 'invoiceList')">修改</span>
                            </div>
                        </a-descriptions-item>
                    </a-descriptions>
                </a-card>
            </div>
        </div>
        <!-- <standard-table :columns="columns" :dataSource="dataSource" :scroll="{ x: 2000 }"
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
</standard-table> -->
        <a-modal v-model="visible" :title="modalTitle" @ok="handleOk" :width="700">
            <PlanFormItem :detail="detail" ref="PlanFormItem" :showType="showType"></PlanFormItem>
            <!-- <PlanForm ref="PlanForm" :type="type" @unpadeList="getData" /> -->
        </a-modal>
    </a-card>
</template>

<script>
// import StandardTable from '@/components/table/StandardTable'
// import PlanForm from '@/pages/electrical/components/planForm'
import PlanFormItem from '@/pages/electrical/components/planFormItem'
import { getProjectEpList, delProjectInfo, getProjectEpInfo } from '@/services/project'
import { mapGetters } from 'vuex'
import moment from 'moment';
function formatDate(timestamp) {
    if (timestamp == '1000-01-01') {
        return '--'
    }
    return timestamp
}
function getStatus(list, v) {
    let res = list.find(item => item.id == v)
    if (res) {
        return res.label
    }
}
import infiniteScroll from 'vue-infinite-scroll';
export default {
    name: 'QueryList',
    directives: { infiniteScroll },
    components: { PlanFormItem },
    data() {
        return {
            modalTitle: "新增项目",
            showType: "",
            advanced: true,
            loading: false,
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
                    title: '电气柜清单',
                    dataIndex: 'electricalListCN',
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
                    title: '现场安装清单',
                    dataIndex: 'invoiceListCN',
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
            permission: [],
            detail: {},
            list: [
                {
                    label: "有",
                    id: 1
                },
                {
                    label: "无",
                    id: 0
                },
            ],
        }
    },
    // authorize: {
    //     deleteRecord: 'delete'
    // },
    mounted() {
        // this.getData()
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
        this.dataSource = []
        this.pagination.pageIndex = 1
        this.getData()
    },
    methods: {
        handleInfiniteOnLoad() {
            this.pagination.pageIndex++
            console.log('ss', this.pagination);
            this.getData()
        },
        async handleEdit(data, type) {
            this.modalTitle = '编辑项目'
            this.visible = true
            this.type = 'edit'
            this.showType = type
            await this.getProjectInfo(data.id)
            this.$nextTick(() => {
                if (['ecRep', 'siRep'].includes(type)) {
                    let value = data[type] ? data[type].split(",").map(item => +item) : [];
                    this.$refs.PlanFormItem.ecForm.setFieldsValue({
                        [type]: value
                    })
                } else {
                    this.$refs.PlanFormItem.ecForm.setFieldsValue({
                        [type]: data[type] == '1000-01-01' ? '' : data[type]
                    })
                }
            })
        },
        getStatus(v) {
            let res = this.statusList.find(item => item.id == v)
            if (res) {
                return res.label
            }
        },
        getListStatus(v) {
            let res = this.list.find(item => item.id == v)
            if (res) {
                return res.label
            }
        },
        async getProjectInfo(id) {
            const res = await getProjectEpInfo({ id })
            if (res.data.status.retCode === 0) {
                this.detail = res.data.data
            }
        },
        // 导出
        async exportFile() {
            if (!window.showSaveFilePicker) {
                let file = await this.getFile('')
                let blob = await file.blob()
                const url = URL.createObjectURL(blob);
                // 创建一个<a>元素用于下载
                const a = document.createElement('a');
                // 设置href为Blob的URL
                a.href = url;
                // 设置下载的文件名，假设后端没有设置Content-Disposition头
                a.download = '电气项目计划表.xlsx'; // 你需要替换为实际的文件名和扩展名
                // 将<a>元素添加到文档中，并模拟点击它
                document.body.appendChild(a);
                a.click();

                // 清理
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                return
            }
            try {
                const opts = {
                    types: [
                        {
                            description: '文件',
                            accept: {
                                'text/plain': ['.xlsx'],
                            }
                        }
                    ],
                    excludeAcceptAllOption: true
                };

                const handle = await window.showSaveFilePicker(opts); // 打开保存文件对话框
                const writable = await handle.createWritable(); // 创建可写入的文件对象
                // 在这里写入文件内容
                let file = await this.getFile(handle.name)
                let blob = await file.blob()
                await writable.write(blob);
                await writable.close();

                this.$message.success('文件保存成功')
            } catch (error) {
                // this.$message.warning('文件保存失败')
                console.error('文件保存失败:', error);
            }
        },
        async getFile(remark) {
            const { pageSize, pageIndex } = this.pagination
            const { dateData, ...formData } = this.form
            let endTime = 0
            let startTime = 0
            if (dateData) {
                startTime = moment(dateData[0])
                endTime = moment(dateData[1])
            }
            let params = { pageSize, pageIndex, ...formData, endTime, startTime, status: 2, remark }
            const API_PROXY_PREFIX = '/api'
            const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
            let user = JSON.parse(localStorage.getItem("userKey"))
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'app-sig': user.sig,
                    'app-ts': user.ts,
                    'app-id': `${user.id}`
                },
                body: JSON.stringify(params)
            };

            return await fetch(BASE_URL + '/project/export_ep_list', options)

        },
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
                console.log(this.$refs.PlanFormItem);
                this.$refs.PlanFormItem.handleSubmit(async () => {
                    this.$message.success('保存成功', 3)
                    this.visible = false
                    await this.getProjectInfo(this.detail.id)
                    let index = this.dataSource.findIndex(item => item.id == this.detail.id)
                    console.log(index);
                    if (index != -1) {
                        this.$set(this.dataSource, index, this.detail)
                    }
                    // this.getData()
                })
            })
        },
        onPageChange(page, pageSize) {
            this.pagination.pageIndex = page
            this.pagination.pageSize = pageSize
            this.getData()
        },
        // 获取列表
        async getData() {
            this.loading = true
            const { pageSize, pageIndex } = this.pagination
            const res = await getProjectEpList({ ...this.form, status: 2, pageSize, pageIndex })
            this.dataSource = [...this.dataSource, ...res.data.data.records]
            this.loading = false
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
    width: calc(80%);
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
<style lang="less">
td {
    box-sizing: border-box;
    white-space: wrap;
}

.plan {

    .ant-descriptions-item-content {
        min-width: 150px;
        &:hover {
            span {
                display: flex;
                cursor: pointer;
            }
        }

        span {
            display: none;
            color: #13c2c2;
            background-color: #fff;
        }

        .item {
            display: flex;
            gap: 6px;
            width: 100%;
            height: 100%;




        }

        .label {
            max-width: 280px;
        }

        position: relative;
        min-height: 21px;
    }
}
</style>