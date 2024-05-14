<template>
    <div>
        <a-card style="margin-bottom: 24px;">
            <div :class="advanced ? 'search' : null">
                <a-form layout="horizontal">
                    <div :class="advanced ? null : 'fold'">
                        <a-row>
                            <a-col :md="6" :sm="24">
                                <a-form-item label="创建用户" :labelCol="{ span: 4 }" :wrapperCol="{ span: 18, offset: 1 }">
                                    <a-select placeholder="请选择" v-model="form.creatorID" allowClear>
                                        <a-select-option :value="item.id" v-for="item in userList" :key="item.id">{{
                                            item.userName }}</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :md="6" :sm="24">
                                <a-form-item label="修改用户" :labelCol="{ span: 4 }" :wrapperCol="{ span: 18, offset: 1 }">
                                    <a-select placeholder="请选择" v-model="form.updaterID" allowClear>
                                        <a-select-option :value="item.id" v-for="item in userList" :key="item.id">{{
                                            item.userName }}</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :md="6" :sm="24">
                                <a-form-item label="时间范围" :labelCol="{ span: 4 }" :wrapperCol="{ span: 18, offset: 1 }">
                                    <a-range-picker valueFormat="YYYY-MM-DD" v-model="form.dateData"
                                        style="width: 100%;" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </div>
                    <span style="float: left; margin-top: 3px;">
                        <a-button type="primary" @click="getNoticeList">查询</a-button>
                        <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
                        <slot name="add"></slot>
                    </span>
                </a-form>
            </div>

            <a-modal v-model="visible" :title="modalTitle" :width="700">
            </a-modal>
        </a-card>
        <a-card>
            <div>
                <a-card-grid :key="item.id" v-for="(item, i) in noticeList">
                    <a-card :loading="loading" :bordered="false" :body-style="{ padding: 0 }">
                        <a-card-meta>
                            <div slot="title" class="card-title">
                                <!-- <a-avatar  :src="item.logo" /> -->
                                <div class="content" @click="goDetail(item)">
                                    <div class="left">
                                        <span class="title">{{ item.title }}</span>
                                        <div class="label">

                                            <span class="creator">{{ item.creator }}</span>
                                            <span class="creator">{{ item.createTime }}</span>
                                        </div>
                                    </div>
                                    <div class="right">
                                        <img class="cover" :src="getImg(item)" alt="">
                                    </div>
                                </div>
                                <div class="project-item">
                                    <a-popconfirm title="确定删除该公告?" v-if="showDelete" ok-text="确定" cancel-text="取消"
                                        @confirm.stop="deleteNotice(item, i)">
                                        <a>
                                            删除
                                        </a>
                                    </a-popconfirm>
                                    <a  v-if="showEdit" @click="handleEdit(item)">
                                        编辑
                                    </a>
                                </div>
                            </div>
                        </a-card-meta>
                    </a-card>
                </a-card-grid>
                <a-empty v-if="!noticeList.length" />
            </div>

        </a-card>
        <a-card :bordered="false">
            <a-pagination @change="pageChange" style="float: right;" :page-size="9" v-model="pagination.current"
                :total="pagination.total" show-less-items />
        </a-card>
    </div>
</template>

<script>

let user = localStorage.getItem('admin.user')
let userid = JSON.parse(user).id
import { mapGetters } from 'vuex'
import moment from 'moment';
import { getNoticeList, delNoticeInfo } from "@/services/backend"
import { getUserList } from "@/services/user"
export default {
    name: 'QueryList',
    data() {
        return {
            modalTitle: "新增员工",
            advanced: true,
            visible: false,
            selectedRows: [],
            loading: false,
            pagination: {
                current: 1,
                pageSize: 9,
                total: 0
            },
            permission: [],
            form: {
                creatorID: userid,
                updaterID: "",
                dateData: undefined
            },
            noticeList: [],
            userList: [],
            actions: [
                { type: 'star-o', text: '156' },
                { type: 'like-o', text: '156' },
                { type: 'message', text: '2' },
            ],
        }
    },
    props: {
        showDelete: {
            type: Boolean,
            default: false
        },
        showEdit: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        this.permission = this.$route.meta.permission
        this.getUserList()
    },
    activated() {
        this.getNoticeList()
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
        handleReset() {
            this.form = {
                creatorID: userid,
                updaterID: "",
                dateData: undefined
            }
            this.getNoticeList()

        },
        async getUserList() {
            let res = await getUserList({})
            this.userList = res.data.data
        },
        handleEdit(data) {
            this.$emit("handleEdit", data)
        },
        getImg(data) {
            if (!data.cover) {
                let randomNum = Math.floor(Math.random() * 5) + 1;
                let imgs = [
                    "1.jpg",
                    "2.jpg",
                    "3.jpg",
                    "4.png",
                    "5.png"
                ]
                return require(`@/assets/cover/${imgs[randomNum - 1]}`)
            } else if (data.cover.includes("custom")) {
                return require(`@/assets/cover/${data.cover.split("/")[1]}`)
            } else {
                return process.env.VUE_APP_API_BASE_URL + data.cover.replace(/^\./, '')
            }
        },
        goDetail(data) {
            this.$router.push({
                path: "/noticeDetail",
                query: {
                    id: data.id
                }
            })
        },
        async getNoticeList() {
            this.loading = true
            const { dateData, ...formData } = this.form
            let endTime = ""
            let startTime = ""
            if (dateData) {
                startTime = moment(dateData[0]).format('YYYY-MM-DD')
                endTime = moment(dateData[1]).format('YYYY-MM-DD')
            }
            let params = {
                "creatorID": this.form.creatorID || 0,
                "updaterID": this.form.updaterID || 0,
                "startTime": startTime,
                "endTime": endTime,
                "pageSize": 9,
                "pageIndex": this.pagination.current
            }
            let res = await getNoticeList(params)
            if (res.data.status.retCode === 0) {
                this.noticeList = res.data.data.records
                this.pagination.total = res.data.data.totalCount
                this.loading = false
            }
        },
        pageChange(v) {
            this.pagination.current = v
            this.getNoticeList()
        },
        async deleteNotice(data, idx) {
            let params = {
                id: data.id
            }
            let res = await delNoticeInfo(params)
            if (res.data.status.retCode === 0) {
                this.$message.success("删除成功")
                this.noticeList.splice(idx, 1)
            }
        }
    }
}
</script>

<style lang="less" scoped>
.search {
    margin-bottom: 54px;
}

.fold {
    width: calc(100% - 216px);
    display: inline-block
}

.cover {
    width: 200px;
    height: 150px;
    object-fit: scale-down;
}

.operator {
    margin-bottom: 18px;
}
.project-item {
    display: flex;
    justify-content: space-between;
}
.card-title {
    span {
        vertical-align: middle;

        &:last-child {
            // margin-left: 12px;
        }
    }

    .content {
        display: flex;
        justify-content: space-between;
        margin-bottom: 18px;

        .left {
            display: flex;
            flex-direction: column;
            width: calc(100% - 100px);

            .title {
                //   max-width: 200px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            .creator {
                font-size: 14px;
                color: #a8a8a8;
                margin-top: 12px;
                font-weight: normal;
            }

            .label {
                display: flex;
                justify-content: space-between;
                width: 100%;
            }
        }

        .right {
            width: 80px;
            height: 60px;
            margin-left: 20px;
            border-radius: 8px;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }
}

@media screen and (max-width: 900px) {
    .fold {
        width: 100%;
    }
}
</style>