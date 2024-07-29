<template>
    <div>
        <a-card>
            <div :class="advanced ? 'search' : null">
                <a-form layout="horizontal">
                    <div :class="advanced ? null : 'fold'">
                        <a-row>
                            <a-col :md="6" :sm="24">
                                <a-form-item label="项目编号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                    <a-input @pressEnter="handleSearch" v-model="form.number" placeholder="请输入" />
                                </a-form-item>
                            </a-col>
                            <a-col :md="6" :sm="24">
                                <a-form-item label="产品编号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                    <a-input @pressEnter="handleSearch" v-model="form.productNumber"
                                        placeholder="请输入" />
                                </a-form-item>
                            </a-col>
                            <a-col :md="6" :sm="24">
                                <a-form-item label="客户名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                    <a-input @pressEnter="handleSearch" v-model="form.customerName" placeholder="请输入" />
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
                <a-button @click="addNew" type="primary" v-if="permission.includes(1)">新建</a-button>
            </a-space>
        </a-card>
        <div class="list" v-infinite-scroll="handleInfiniteOnLoad" :infinite-scroll-disabled="false"
            :infinite-scroll-distance="100">
            <div class="card" v-for="(item, idx) in dataSource" :key="item.id">
                <div class="box">
                    <div class="left">
                        <div class="title">
                            <h1 :title="item.id">{{ item.customerName || '通用耗材领料' }}</h1>
                            <div class="tags">
                                <div class="item">{{ item.productName }}</div>
                            </div>
                            <a style="margin-right: 20px;" @click="handleFlowDetail(item)">报备日志</a>
                            <!-- <a-icon type="style="margin-left: auto;" class="qrcode" @click="handlePrintQrcode(item)"/> -->
                        </div>

                        <div class="content">
                            <!-- <div class="item">
                                <div class="label">项目编号：</div>
                                <div class="value">{{ item.number }}</div>
                            </div> -->

                            <div class="item">
                                <div class="label">客户名称：</div>
                                <div class="value">{{ item.customerName || '--' }}</div>
                            </div>
                            <div class="item">
                                <div class="label">产品编号：</div>
                                <div class="value">{{ item.productNumber || '--' }}</div>
                            </div>
                            <div class="item">
                                <div class="label">型号：</div>
                                <div class="value">{{ item.model || '--' }}</div>
                            </div>
                            <div class="item">
                                <div class="label">发货单位：</div>
                                <div class="value">{{ item.fromCompany || '--' }}</div>
                            </div>
                            <div class="item">
                                <div class="label">申请人：</div>
                                <div class="value">{{ item.applyRealName || '--' }}</div>
                            </div>
                            <div class="item">
                                <div class="label">申请日期：</div>
                                <div class="value">{{ item.applyDate || '--' }}</div>
                            </div>
                            <div class="item">
                                <div class="label">来源：</div>
                                <div class="value">{{ item.source || '--' }}</div>
                            </div>

                            <div class="item">
                                <div class="label">完整率：</div>
                                <div class="value">{{ getProgress(item.progress) || '--' }}</div>
                            </div>
                        </div>


                    </div>
                    <div class="btn">
                        <div class="edit" @click="lookDetail(item)" v-if="permission.includes(3)">查看详情</div>
                        <div class="del" @click="handleEdit(item)">编辑</div>
                        <a-popconfirm title="确定删除该项目?" ok-text="确定" cancel-text="取消"
                            @confirm="delShotageInfo(item, idx)" v-if="permission.includes(2)">
                            <div class="del">删除</div>
                        </a-popconfirm>
                    </div>
                </div>
            </div>
        </div>
        <div class="no-data" v-if="!dataSource.length">
            <a-empty />
        </div>
        <a-modal v-model="showModel" title="缺料报备" @ok="showModel = false" :width="1600">
            <materialForm ref="materialForm" @handleUpdate="handleUpdate" :permission="permission"/>
        </a-modal>
        <a-modal v-model="showFormModel" title="缺料报备" @ok="handleSubmit" :width="600">
            <materialFormMoel :key="key" :type="modelType" ref="materialFormMoel" />
        </a-modal>
        <a-modal v-model="showProcess" title="报备日志" @ok="showType = false" :width="1200" class="processCom">
            <processCom  :flowType="2" :id="projectID" ref="process"></processCom>
        </a-modal>

    </div>
</template>

<script>
import processCom from '@/pages/electrical/process'
import StandardTable from '@/components/table/StandardTable'
import materialForm from '@/pages/electrical/components/materialForm'
import materialFormMoel from '@/pages/electrical/components/materialFormMoel'
import { getShotageList, delShotageInfo } from '@/services/electrical'
import { mapGetters } from 'vuex/dist/vuex.common.js'
// function formatDate(timestamp) {
//   const date = new Date(timestamp * 1000); // 注意时间戳要乘以1000，因为JavaScript中的时间戳是以毫秒为单位的
//   const year = date.getFullYear();
//   const month = date.getMonth() + 1; // 月份从0开始，所以需要加1
//   const day = date.getDate();
//   return `${year}-${String(month).padStart(2, 0)}-${String(day).padStart(2, 0)}`;
// }+
import infiniteScroll from 'vue-infinite-scroll';
import moment from 'moment';
export default {
    name: 'QueryList',
    components: { StandardTable, materialForm, materialFormMoel, processCom },
    directives: { infiniteScroll },
    data() {
        return {
            modelType: "add",
            showProcess: false,
            materialFormKey: 0,
            modalTitle: "新增项目",
            projectID: "",
            showFormModel: false,
            advanced: true,
            key: 0,
            showModel: false,
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
            type: 'add',
            dataSource: [],
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0
            },
            form: {

            },
            permission: [],
        }
    },

    computed: {
        ...mapGetters('setting', ['menuData']),
    },
    watch: {
        menuData() {
            this.permission = this.$route.meta.permission
        }
    },
    async activated() {
        this.pagination.current = 1
        this.dataSource = []
        await this.getData()
        if (this.$route.meta) {
            this.permission = this.$route.meta.permission
        }
    },
    methods: {
        handleInfiniteOnLoad() {
            this.pagination.current++
            this.getData()
        },
        handleUpdate() {
            this.pagination.current = 1
            this.dataSource = []
            this.getData()
        },
        getProgress(v) {
            if (v) {
                return v + '%'
            } else {
                return '0%'
            }
        },
        toggleAdvanced() {
            this.advanced = !this.advanced
        },
        handleSearch() {
            this.pagination.current = 1
            this.dataSource = []
            this.getData()
        },
        handleReset() {
            this.pagination.current = 1
            this.form = {}
            this.dataSource = []
            this.getData()
        },
        // 获取列表
        async getData() {
            const { pageSize, current } = this.pagination
            let params = {
                pageSize,
                pageIndex: current,
                deleted: 2,
                ...this.form
            }
            const res = await getShotageList(params)
            this.dataSource = [...this.dataSource, ...res.data.data.records]
            this.pagination.total = res.data.data.totalCount
        },
        lookDetail(data) {
            this.materialFormKey++
            this.modalTitle = '编辑项目'
            this.showModel = true
            this.type = 'edit'
            this.$nextTick(() => {
                this.$refs.materialForm.getShotageInfo(data.id)
            })
        },
        handleEdit(data) {
            this.modalTitle = '编辑项目'
            this.showFormModel = true
            this.modelType = 'edit'
            this.$nextTick(() => {
                this.$refs.materialFormMoel.initData(data.id)
            })
        },
        handleSubmit() {
            this.$refs.materialFormMoel.handleSubmit(() => {
                this.showFormModel = false
                this.pagination.current = 1
                this.dataSource = []
                this.getData()
            })
        },
   
        async delShotageInfo(data, index) {
            const params = {
                id: data.id,
                "deleted": 1
            }
            let res = await delShotageInfo(params)
            if (res.data.status.retCode == 0) {
                this.$message.success("操作成功")
                this.dataSource.splice(index, 1)
            } else {
                this.$message.warning("操作失败")
            }
            // this.getData()
        },
        addNew() {
            this.type = 'add'
            this.modelType = 'add'
            this.showFormModel = true
            this.key++
            this.modalTitle = '新增项目'
            this.$nextTick(() => {
                this.$refs.materialFormMoel.resetFields()
            })
        },
        handleFlowDetail(data) {
            this.projectID = data.id
            this.showProcess = true
            this.$nextTick(() => {
                this.$refs.process.init()
            })
        },
    }
}
</script>

<style lang="less" scoped>
.list {
    margin-top: 24px;
    border-radius: 8px;
    max-height: calc(100vh - 320px);
    /* or any other appropriate height */
    overflow-y: auto;
    overflow-x: hidden;

    .del {
        color: rgb(80, 122, 253);
        cursor: pointer;
        text-decoration: underline;
        display: inline-block;
        margin-top: 12px;
    }

    .card {
        width: 100%;
        background-color: #fff;
        padding: 30px;
        box-sizing: border-box;
        display: flex;
        border-bottom: solid 1px #f0f0f0;

        .box {
            display: flex;
            width: 100%;
            justify-content: space-between;

            .btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                .edit {
                    background-color: rgb(80, 122, 253);
                    color: #fff;
                    height: 34px;
                    display: block;
                    width: 100px;
                    text-align: center;
                    line-height: 34px;
                    cursor: pointer;
                    border-radius: 4px;

                    // margin-bottom: 12px;
                    &:hover {
                        background-color: rgb(71, 108, 219);
                    }
                }
            }
        }

        .cover {
            width: 78px;
            height: 78px;
            background-color: rgb(126, 180, 216);
            border-radius: 8px;
            margin-right: 30px;
            font-size: 22px;
            font-weight: bold;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .left {
            .title {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
            }

            h1 {
                font-size: 18px;
                margin-bottom: 0;
                margin-right: 12px;
                font-weight: bold;
            }

            .tags {

                .item {
                    color: rgb(192, 151, 254);
                    background: rgb(241, 237, 249);
                    text-align: center;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    display: inline;
                    margin-right: 12px;
                }

                .orange {
                    background: rgb(251, 237, 215);
                    color: rgb(254, 185, 94);
                }
            }
            .qrcode {
                cursor: pointer;
                font-size: 22px;
            }

            .content {
                margin-top: 12px;
                display: flex;
                // width: 900px;
                flex-wrap: wrap;
                // justify-content: space-between;
                gap: 12px;

                .item {
                    display: flex;
                    width: 280px;
                    margin-right: 8px;

                    .label {
                        color: rgb(155, 155, 155);
                        min-width: 56px;
                    }

                    .value {
                        color: #12151b;
                        font-weight: bold;
                        // white-space: nowrap;
                        flex: 1;
                    }
                }
            }

        }
    }
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
<style lang="less">
.project-modal {
    .ant-modal {
        top: 19px
    }
}
.processCom {
    .ant-modal {
        top: 30px
    }
}
</style>