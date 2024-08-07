<template>
    <div>
        <div class="filter">
            <a-row>
                <a-col :md="8" :sm="24">
                    <a-form-item label="产品名称" :labelCol="{ span: 8 }" :wrapperCol="{ span: 14, offset: 1 }">
                        <a-select allowClear :placeholder="'请选择产品名称'" v-model="form.productName" @change="handleSearch" style="width: 100%;">
                            <a-select-option :value="item" v-for="item in productName" :key="item">{{ item
                                }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                    <a-form-item label="产品编号" :labelCol="{ span: 8 }" :wrapperCol="{ span: 14, offset: 1 }">
                        <a-input @pressEnter="handleSearch" v-model="form.productNumber" placeholder="请输入" />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                    <a-form-item label="客户名称" :labelCol="{ span: 8 }" :wrapperCol="{ span: 14, offset: 1 }">
                        <a-input @pressEnter="handleSearch" v-model="form.customerName" placeholder="请输入" />
                    </a-form-item>
                </a-col>
            </a-row>
        </div>
        <a-table :columns="columns" :dataSource="dataSource" :rowKey="record => record.id"
            v-model="pagination.pageIndex" :pagination="pagination" @change="change">
            <template slot="select" slot-scope="text, record">
                <a-radio-group v-model="selectedRow" @change="handleRadioChange(record.id)">
                    <a-radio :value="record.id"></a-radio>
                </a-radio-group>
            </template>
        </a-table>
    </div>
</template>

<script>
import moment from 'moment';
import { getProjectList } from '@/services/project'
export default {
    data() {
        return {
            selectedRow: null,
            projectName: "",
            form: {},
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
                    title: '选择',
                    key: 'select',
                    scopedSlots: { customRender: 'select' },
                },
                {
                    title: '项目编号',
                    dataIndex: 'number',
                },
                {
                    title: '产品编号',
                    dataIndex: 'productNumber',
                },
                {
                    title: '产品名称',
                    dataIndex: 'productName',
                },
                {
                    title: '客户名称',
                    dataIndex: 'customerName',
                },
                {
                    title: '型号',
                    dataIndex: 'model'
                },

            ],
            dataSource: [

            ],
            pagination: {
                current: 1,
                pageSize: 5,
                total: 0
            },
            projectInfo: ""
        };
    },
    created() {
        this.getData()
    },
    methods: {
        change(v) {
            this.pagination.current = v.current
            this.getData()
        },
        handleSearch() {
            this.pagination.current = 1
            this.getData()
        },
        handleRadioChange(key) {
            this.selectedRow = key;
            this.projectInfo = this.dataSource.find(item=> item.id == key)
            console.log('Selected row key:', this.projectInfo);
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
            this.dataSource = res.data.data.records
            this.pagination.total = res.data.data.totalCount
        },
    },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>