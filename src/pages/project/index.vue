<template>
    <div>
        <a-card>
            <div :class="advanced ? 'search' : null">
                <a-form layout="horizontal">
                    <div :class="advanced ? null : 'fold'">
                        <a-row>
                            <a-col :md="6" :sm="24">
                                <a-form-item label="产品名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                    <a-select :placeholder="'请选择产品名称'" v-model="form.productName"
                                        @change="handleSearch">
                                        <a-select-option :value="item" v-for="item in productName" :key="item">{{ item
                                            }}</a-select-option>
                                    </a-select>
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
                            <a-col :md="6" :sm="24">
                                <a-form-item label="时间范围" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                    <a-range-picker v-model="form.dateData" style="width: 100%;" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row v-if="advanced">
                            <!-- <a-col :md="6" :sm="24">
                            <a-form-item label="真实姓名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                                <a-input placeholder="请输入" v-model="form.nickName"/>
                            </a-form-item>
                        </a-col> -->

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
                <a-button @click="exportFile" type="danger" v-if="permission.includes(5)">导出</a-button>
                <a-upload name="file" :multiple="true" action="#" :headers="headers" @change="handleChange"
                    v-if="permission.includes(6)" :showUploadList="false" :customRequest="customRequest">
                    <a-button> <a-icon type="upload" /> 导入 </a-button>
                </a-upload>
            </a-space>
            <a-modal v-model="visible" :title="modalTitle" @ok="handleOk" :width="1500" class="project-modal">
                <ProjectForm ref="ProjectForm" :type="type" :key="projectFormKey" />
            </a-modal>
        </a-card>
        <div class="list" v-infinite-scroll="handleInfiniteOnLoad" :infinite-scroll-disabled="false"
            :infinite-scroll-distance="100">
            <div class="card" v-for="(item, idx) in dataSource" :key="item.id">
                <div class="box">
                    <div class="left">
                        <div class="title">
                            <h1 :title="item.id"  @click="copyToClipboard(item.customerName)">{{ item.customerName }}</h1>
                            <a-tag :color="getColor(item.level)" style="border-radius: 22px;">
                                P{{ item.level }}
                            </a-tag>
                            <div class="tags"  @click="copyToClipboard(item.productName)">
                                <div class="item">{{ item.productName }}</div>
                            </div>
                        </div>

                        <div class="content">
                            <div class="item" @click="copyToClipboard(item.number)">
                                <div class="label">项目编号：</div>
                                <div class="value">{{ item.number }}</div>
                            </div>
                            <div class="item" @click="copyToClipboard(item.productNumber)">
                                <div class="label">产品编号：</div>
                                <div class="value">{{ item.productNumber || '--' }}</div>
                            </div>
                            <div class="item" @click="copyToClipboard(item.model)">
                                <div class="label">型号：</div>
                                <div class="value">{{ item.model || '--' }}</div>
                            </div>
                            <div class="item">
                                <div class="label">下单日期：</div>
                                <div class="value">{{ item.orderDate || '--' }}</div>
                            </div>
                            <div class="item">
                                <div class="label">发货日期：</div>
                                <div class="value">{{ item.deliveryDate || '--' }}</div>
                            </div>
                            <div class="item">
                                <div class="label">工作压力(MPa)：</div>
                                <div class="value">{{ item.workingPressure || '--' }}</div>
                            </div>
                            <div class="item">
                                <div class="label">工作温度(℃)：</div>
                                <div class="value">{{ item.workingTemperature || '--' }}</div>
                            </div>
                            <div class="item">
                                <div class="label">加热功率(kw)：</div>
                                <div class="value">{{ item.heatingPower || '--' }}</div>
                            </div>
                            <div class="item">
                                <div class="label">循环风机：</div>
                                <div class="value">{{ item.circulatingFan || '--' }}</div>
                            </div>
                            <div class="item">
                                <div class="label">热电偶：</div>
                                <div class="value">{{ item.thermocouple || '--' }}</div>
                            </div>
                            <div class="item">
                                <div class="label">检测口：</div>
                                <div class="value">{{ item.inspectionPort || '--' }}</div>
                            </div>
                            <div class="item">
                                <div class="label">真空路数：</div>
                                <div class="value">{{ item.vacuumNumber || '--' }}</div>
                            </div>
                            <div class="item">
                                <div class="label">增压机：</div>
                                <div class="value">{{ item.supercharger || '--' }}</div>
                            </div>
                            <div class="item">
                                <div class="label">空压机：</div>
                                <div class="value">{{ item.airCompressor || '--' }}</div>
                            </div>
                        </div>


                    </div>
                    <div class="btn">
                        <div class="edit" @click="edit(item)" v-if="permission.includes(3)">查看详情</div>
                        <a-popconfirm title="确定删除该项目?" ok-text="确定" cancel-text="取消"
                            @confirm="delProjectInfo(item, idx)" v-if="permission.includes(2)">
                            <div class="del">删除</div>
                        </a-popconfirm>
                    </div>
                </div>
            </div>
        </div>
        <div class="no-data" v-if="!dataSource.length">
            <a-empty />
        </div>
    </div>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import ProjectForm from '@/pages/project/components/projectForm'
import { getProjectList, delProjectInfo, importProjectList } from '@/services/project'
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
    components: { StandardTable, ProjectForm },
    directives: { infiniteScroll },
    data() {
        return {
            projectFormKey: 0,
            headers: {
                authorization: 'authorization-text',
            },
            modalTitle: "新增项目",
            advanced: true,
            visible: false,
            dateData: undefined,
            productName: [
                "热压罐",
                "储气罐",
                "液压釜",
                "固化炉",
                "浸渍罐",
                "系统改造",
                "冷却系统",
                "烘箱",
                "缓冲罐"
            ],
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
                    width: 200,
                },
                {
                    title: '型号',
                    width: 80,
                    dataIndex: 'model'
                },
                {
                    title: '级别',
                    key: 'tags',
                    dataIndex: 'level',
                    width: 80,
                    scopedSlots: { customRender: 'tags' },
                },
                {
                    title: "下单日期",
                    dataIndex: "orderDate",
                    width: 80
                },
                {
                    title: "发货日期",
                    dataIndex: "deliveryDate",
                    width: 80
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
                current: 1,
                pageSize: 10,
                total: 0
            },
            form: {

            },
            clientList: [],
            operaList: [],
            permission: [],
            uploadLoading: false
        }
    },

    computed: {
        ...mapGetters('setting', ['menuData']),
        // permission () {
        //     if(this.$route.meta.permission) {
        //         let list = this.$route.meta.permission
        //         return list
        //     } else {
        //         return []
        //     }
        // }
    },
    watch: {
        menuData() {
            this.permission = this.$route.meta.permission
        }
    },
    // menuData
    // authorize: {
    //     deleteRecord: 'delete'
    // },
    async activated() {
        if (this.$route.query.year) {
            this.setDatesFromUrl()
        }
        this.pagination.current = 1
        this.dataSource = []
        await this.getData()
        if (this.$route.meta) {
            this.permission = this.$route.meta.permission
        }
    },
    methods: {
        copyToClipboard(text) {
            var textarea = document.createElement('textarea');
            textarea.style.position = 'fixed';
            textarea.style.opacity = 0;
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.$message.success("复制成功")
        },
        handleInfiniteOnLoad() {
            this.pagination.current++
            console.log(this.pagination.pageIndex);
            // return
            this.getData()
        },
        toggleAdvanced() {
            this.advanced = !this.advanced
        },
        setDatesFromUrl() {
            if (year === '全部') {
                this.form.dateData = ""
                return
            }
            const year = this.$route.query.year;
            const month = this.$route.query.month;
            if (year && month) {
                console.log(year, month);
                const startDate = moment(`${year}-${month}-01`);
                const endDate = startDate.clone().endOf('month');
                this.form.dateData = [startDate, endDate];
                console.log(this.form.dateData, 'sssdfsf');
            }
        },
        // 
        handleChange() {

        },
        async customRequest(data) {
            console.log(data);
            const form = new FormData()
            form.append('excel', data.file)
            console.log(form);
            this.uploadLoading = true
            const res = await importProjectList(form)
            if (res.data.status.retCode == 0) {
                this.uploadLoading = false
                this.getData()
                this.$message.success(`成功导入${res.data.data}条数据`)
            } else {
                this.$message.success(res.data.status.msg)
                this.uploadLoading = false
            }
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
            const { pageSize, current } = this.pagination
            const { dateData, ...formData } = this.form
            let endDate = ""
            let startDate = ""
            if (dateData) {
                startDate = moment(dateData[0]).format('YYYY-MM-DD')
                endDate = moment(dateData[1]).format('YYYY-MM-DD')
            }
            let params = {
                ...formData,
                startDate,
                endDate,
                level: 0,
                pageSize,
                remark,
                pageIndex: current
            }
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
            return await fetch(BASE_URL + '/project/export_project_list', options)

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
        handleOk() {
            this.$nextTick(() => {
                this.$refs.ProjectForm.handleSubmit(() => {
                    this.$message.success('保存成功', 3)
                    this.visible = false
                    this.pagination.current = 1
                    this.dataSource = []
                    this.getData()
                })
            })
        },
        onPageChange(page, pageSize) {
            this.pagination.current = page
            this.pagination.pageSize = pageSize
            this.getData()
        },
        // 获取列表
        async getData() {
            const { pageSize, current } = this.pagination
            const { dateData, ...data } = this.form
            let endDate = ""
            let startDate = ""
            if (dateData) {
                startDate = moment(dateData[0]).format('YYYY-MM-DD')
                endDate = moment(dateData[1]).format('YYYY-MM-DD')
            }
            const res = await getProjectList({ pageSize, pageIndex: current, startDate, endDate, ...data })
            this.dataSource = [...this.dataSource, ...res.data.data.records]
            this.pagination.total = res.data.data.totalCount
        },
        edit(data) {
            this.projectFormKey++
            this.modalTitle = '编辑项目'
            this.visible = true
            this.type = 'edit'
            this.$nextTick(() => {
                this.$refs.ProjectForm.getProjectInfo(data.id)
            })
        },
        async delProjectInfo(data, index) {
            const params = {
                id: data.id
            }
            let res = await delProjectInfo(params)
            if (res.data.status.retCode == 0) {
                this.$message.success("操作成功")
                this.dataSource.splice(index, 1)
            } else {
                this.$message.warning("操作失败")
            }
            // this.getData()
        },
        addNew() {
            this.projectFormKey++
            this.type = 'add'
            this.modalTitle = '新增项目'
            this.visible = true
            this.$nextTick(() => {
                this.$refs.ProjectForm.resetFields()
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

            .content {
                margin-top: 12px;
                display: flex;
                // width: 900px;
                flex-wrap: wrap;
                // justify-content: space-between;
                gap: 12px;

                .item {
                    display: flex;
                    width: 200px;
                    margin-right: 8px;

                    .label {
                        color: rgb(155, 155, 155);
                        min-width: 56px;
                    }

                    .value {
                        color: #12151b;
                        font-weight: bold;
                        // white-space: nowrap;
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
</style>