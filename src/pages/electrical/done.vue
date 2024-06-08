<template>
    <div class="plan">
        <a-card>
            <div :class="advanced ? 'search' : null">
                <a-form layout="horizontal">
                    <div :class="advanced ? null : 'fold'">
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
            <a-modal v-model="visible" :title="modalTitle" @ok="handleOk" :width="700">
                <PlanFormItem :detail="detail" ref="PlanFormItem" :showType="showType"></PlanFormItem>
            </a-modal>
            <a-modal v-model="showProcess" title="电气流程" @ok="showType = false" :width="1200">
                <process :id="projectID" ref="process"></process>
            </a-modal>
            <a-modal v-model="showFile" title="清单文件" @ok="showFile = false" :width="700" >
                <fileModel :permission="permission" :projectID="projectID" ref="fileModel"></fileModel>
            </a-modal>
        </a-card>
        <div class="scrollList" v-infinite-scroll="handleInfiniteOnLoad" :infinite-scroll-disabled="false"
            :infinite-scroll-distance="100">
            <a-empty v-if="!dataSource.length" />
            <a-card class="card" v-for="item in dataSource" :key="item.id">
                <div class="header">
                    <h1>{{ item.customerName }}<span>（型号：{{ item.model }}）</span></h1>
                    <a style="margin-left: auto;margin-right: 20px" @click="handleDetail(item)">电气分析</a>
                    <a style="margin-right: 20px;" @click="handleFlowDetail(item)">电气流程</a>
                    <a style="margin-right: 20px;" @click="handleFileOpen(item)">清单文件</a>
                    <a-tag :color="getColor(item.level)" style="border-radius: 22px; height: 22px;">
                        P{{ item.level }}
                    </a-tag>
                </div>
                <div class="content flex">
                    <div class="item">
                        <div class="label">产品名称：</div>
                        <div class="value">{{ item.productName }}</div>
                    </div>
                    <div class="item num">
                        <div class="label">产品编号：</div>
                        <div class="value">{{ item.productNumber }}</div>
                    </div>
                    <div class="item">
                        <div class="label">下单日期：</div>
                        <div class="value">{{ getDate(item.orderDate) }}</div>
                    </div>
                    <div class="item">
                        <div class="label">发货日期：</div>
                        <div class="value">{{ getDate(item.deliveryDate) }}</div>
                    </div>
                </div>
                <div class="content noborder">
                    <div class="flex_2 border">
                        <h2>电气柜</h2>
                        <div class="flex">
                            <div class="item repName">
                                <div class="label">负责人：</div>
                                <div class="value">{{ item.ecRepName || '--' }}</div>
                                <span  v-if="permission.includes(3)" @click="handleEdit(item, 'ecRep')">修改</span>
                            </div>
                            <div class="item">
                                <div class="label">开始日期：</div>
                                <div class="value">{{ getDate(item.ecStartDate) || '--' }}</div>
                                <span  v-if="permission.includes(3)" @click="handleEdit(item, 'ecStartDate')">修改</span>
                            </div>
                            <div class="item">
                                <div class="label">结束日期：</div>
                                <div class="value">{{ getDate(item.ecEndDate) || '--' }}</div>
                                <span  v-if="permission.includes(3)" @click="handleEdit(item, 'ecEndDate')">修改</span>
                            </div>
                            <div class="item">
                                <div class="label">安装状态：</div>
                                <div class="value">{{ getStatus(item.ecStatus) || '--' }}</div>
                                <span  v-if="permission.includes(3)" @click="handleEdit(item, 'ecStatus')">修改</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content noborder">
                    <div class="flex_2">
                        <h2>现场安装</h2>
                        <div class="flex">
                            <div class="item repName">
                                <div class="label">负责人：</div>
                                <div class="value">{{ item.siRepName || '--' }}</div>
                                <span  v-if="permission.includes(3)" @click="handleEdit(item, 'siRep')">修改</span>
                            </div>
                            <div class="item">
                                <div class="label">开始日期：</div>
                                <div class="value">{{ getDate(item.siStartTime) || '--' }}</div>
                                <span  v-if="permission.includes(3)" @click="handleEdit(item, 'siStartTime')">修改</span>
                            </div>
                            <div class="item">
                                <div class="label">结束日期：</div>
                                <div class="value">{{ getDate(item.siEndTime) || '--' }}</div>
                                <span  v-if="permission.includes(3)" @click="handleEdit(item, 'siEndTime')">修改</span>
                            </div>
                            <div class="item">
                                <div class="label">安装状态：</div>
                                <div class="value">{{ getStatus(item.siStatus) || '--' }}</div>
                                <span  v-if="permission.includes(3)" @click="handleEdit(item, 'siStatus')">修改</span>
                            </div>
                        </div>
                    </div>
                </div>
            </a-card>
        </div>
    </div>
</template>

<script>
// import StandardTable from '@/components/table/StandardTable'
// import PlanForm from '@/pages/electrical/components/planForm'
import PlanFormItem from '@/pages/electrical/components/planFormItem'
import process from '@/pages/electrical/process'
import fileModel from '@/pages/electrical/components/fileModel'
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
    components: { PlanFormItem, process, fileModel },
    data() {
        return {
            showProcess: false,
            modalTitle: "新增项目",
            showType: "",
            showFile: false,
            advanced: true,
            loading: false,
            visible: false,
            projectID: "",
            productName: [
                "热压罐",
                "储气罐",
                "液压釜",
                "固化炉",
                "浸渍罐",
                "系统改造",
                "冷却系统",
                "烘箱",
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
                    title: '电气清单',
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
                    title: '发货清单',
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
            this.getData()
        },
        getDate(date) {
            if (date == '1000-01-01') return '--'
            return date
        },
        handleDetail(data) {
            this.$router.push({
                path: "/statistics/order",
                query: {
                    id: data.id
                }
            })
        },
        handleFlowDetail(data) {
            this.projectID = data.id
            this.showProcess = true
            this.$nextTick(()=>{
                this.$refs.process.init()
            })
        },
        handleFileOpen(data) {
            this.projectID = data.id
            this.showFile = true
            this.$nextTick(()=>{
                this.$refs.fileModel.getProjectFile()
            })
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
            let params = { pageSize, pageIndex, ...formData, endTime, startTime, status: 4, remark }
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
            this.dataSource = []
            this.pagination.pageIndex = 1
            this.getData()
        },
        handleReset() {
            this.dataSource = []
            this.pagination.pageIndex = 1
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
            const res = await getProjectEpList({ ...this.form, status: 4, pageSize, pageIndex })
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
        getColor(le) {
            switch (le) {
                case 1:
                    return "rgb(240, 112, 78)";
                case 2:
                    return "rgb(254, 178, 56)";
                case 3:
                    return "rgb(104, 197, 109)";
                case 4:
                    return "rgb(81, 215, 214)";
                case 5:
                    return "rgb(146, 102, 248)"
            }
            console.log(le, 'ss');
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

    .scrollList {
        display: flex;
        flex-wrap: wrap;
        gap: 24px;
        margin-top: 24px;

        ::v-deep .ant-card-body {
            padding: 0;
        }

        .card {
            width: 100%;
            border-radius: 10px;
            padding: 0;

            .header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 14px;
                // background-color: red;

                h1 {
                    span {
                        font-size: 16px;
                        color: #8d8d8d;
                        font-weight: normal;
                        margin-left: 12px;
                    }

                    font-size: 18px;
                    font-weight: bold;
                }
            }

            .content {
                margin-bottom: 12px;
                border-bottom: solid #f2f2f2 1px;
                padding-bottom: 4px;

                .item {
                    width: 25%;
                    // flex: 1 / 3;
                    display: flex;

                    span {
                        color: #13c2c2;
                        cursor: pointer;
                        margin-left: 12px;
                        display: none;
                    }

                    &:hover {
                        span {
                            display: block;
                        }
                    }
                }

                .num {
                    margin-left: 120px;
                }

                .label {
                    font-size: 14px;
                    font-weight: bold;
                    color: #002925;
                    margin-bottom: 8px;
                    margin-right: 8px;
                }

                h2 {
                    font-size: 14px;
                    font-weight: bold;
                    color: #13c2c2;
                }
            }

            .noborder {
                border: none;
                margin-bottom: 0;
            }

            .flex {
                display: flex;
                justify-content: space-between;
            }

            .nobottom {
                .item {
                    .label {
                        margin-bottom: 0;
                    }
                }

                h2 {
                    margin-bottom: 0;
                }
            }

            .flex_2 {
                display: flex;

                h2 {
                    margin-right: 20px;
                    width: 100px;
                }

                .flex {
                    width: calc(100% - 100px);
                    justify-content: flex-start;

                    .item {
                        width: 25%;
                    }

                    // .repName {
                    //     width: 200px;
                    // }
                }
            }

            .flex_3 {
                h2 {
                    margin-right: 20px;
                    width: 100px;
                }

                display: flex;
                justify-content: flex-start;

                .item {
                    width: 358px;
                }

                .list {
                    // width: 378px;
                    // margin-right: 266px;
                }

                white-space: nowrap;
            }
        }
    }
}
</style>