<template>
    <div>
        <div class="new-page statistics">
            <div class="header">
                <div class="choose">
                    <div class="item">
                        <div class="label">客户名称：</div>
                        <a-input placeholder="请输入客户名称" v-model="customerName"></a-input>
                    </div>
                    <div class="item">
                        <div class="label">切换图表：</div>
                        <a-select placeholder="请选择" @change="handleChartModelChange" v-model="chartModel"
                            style="width: 100%;">
                            <a-select-option :value="item.value" v-for="item in chartList" :key="item.value">{{
                                item.label
                            }}</a-select-option>
                        </a-select>
                    </div>
                    <div class="item">
                        <a-button type="primary" @click="handleSearch">查询</a-button>
                        <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
                    </div>
                </div>

            </div>
        </div>
        <div class="content">
            <div class="left" v-infinite-scroll="handleInfiniteOnLoad" :infinite-scroll-disabled="busy"
                :infinite-scroll-distance="10">
                <!-- <a-list item-layout="horizontal" :data-source="dataSource">
                    <a-list-item slot="renderItem" slot-scope="item, index">
                        <a-list-item-meta
                            :description="item.customerName">
                            <a slot="title" @click="handleClick(item, index)" :class="{active: index == active}">{{ item.customerName }}</a>
                        </a-list-item-meta>
                    </a-list-item>
                </a-list> -->
                <ul class="content-list">
                    <li v-for="(item,index) in dataSource" :key="item.id"  @click="handleClick(item, index)" >
                        <h1 :class="{active: index == active}">{{ item.customerName }}</h1>
                        <div>
                            <div>
                                {{ item.customerName }}<span>{{ item.model }}</span>
                            </div>
                            <div>
                                产品编号：{{ item.productNumber }}
                            </div>
                        </div>
                    </li>
                </ul>

            </div>
            <div class="chart-box">
                <div class="card" v-show="chartModel === 0">
                    <div class="chart" id="employeeCharts"></div>
                </div>
                <div class="card" v-show="chartModel === 1">
                    <div class="chart" id="barAnalysisCharts"></div>
                </div>
                <div class="card" v-show="chartModel === 2">
                    <div class="pie">
                        <div class="pieChart" id="pieChart_1"></div>
                        <div class="pieChart" id="pieChart_2"></div>
                        <div class="pieChart" id="pieChart_3"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getEpAnalyse, getProjectYear, getProjectEpList } from '@/services/project'
import { getDeptList } from '@/services/user'
import * as echarts from 'echarts';
import { mapState } from 'vuex'
import infiniteScroll from 'vue-infinite-scroll';

export default {
    name: 'Log',
    directives: { infiniteScroll },
    data() {
        return {
            years: [

            ],
            customerName: "",
            detail: [],
            projectID: "",
            active: 0,
            data: [
               
            ],
            deptID: 51,
            deptList: [],
            chartModel: 0,
            chartList: [
                {
                    label: "折线图",
                    value: 0
                },
                {
                    label: "柱状图",
                    value: 1
                },
            ],
            loading: false,
            busy: false,
            year: "",
            month: "全部",
            months: [
                "全部",
                "01",
                "02",
                "03",
                "04",
                "05",
                "06",
                "07",
                "08",
                "09",
                "10",
                "11",
                "12",
            ],
            myBarCharts_1: null,
            lineCharts_1: null,
            pieChart_1: null,
            pieChart_2: null,
            pieChart_3: null,
            pagination: {
                pageSize: 10,
                pageIndex: 1
            },
            dataSource: []
        }
    },
    computed: {
        ...mapState('setting', ['pageMinHeight']),
        desc() {
            return this.$t('description')
        }
    },
    mounted() {
        // this.initLineCharts_1();

    },
    activated() {
        this.pagination.pageIndex = 1
        this.active = this.$route.query.id || 0
        this.dataSource = []
        this.getData().then(async () => {
            this.getEpAnalyse()
        })

    },
    deactivated() {
        this.myBarCharts_1.dispose()
        this.lineCharts_1.dispose()
    },
    methods: {
        handleChange() {
            this.getEpAnalyse()
        },
        handleMonthChange() {
            this.getEpAnalyse()
        },
        async handleInfiniteOnLoad() {
            this.pagination.pageIndex++
            await this.getData()
        },
        handleClick(v, idx) {
            this.active = idx
            this.projectID = v.id
            this.getEpAnalyse()
        },
        handleReset() {
            this.pagination = {
                pageSize: 10,
                pageIndex: 1
            }
            this.dataSource = []
            this.customerName = ""
            this.getData(true)
        },
        handleSearch() {
            this.pagination = {
                pageSize: 10,
                pageIndex: 1
            }
            this.dataSource = []
            this.getData(true)
        },
        // 获取列表
        async getData(flag) {
            this.loading = true
            const { pageSize, pageIndex } = this.pagination
            const res = await getProjectEpList({ status: 0, pageSize, pageIndex, customerName: this.customerName })
            this.dataSource = [...this.dataSource, ...res.data.data.records]
            this.loading = false
            this.projectID = +this.$route.query.id || res.data.data.records[0].id
            this.pagination.total = res.data.data.totalCount
            if(flag) {
                this.handleClick(this.dataSource[0], 0)
            }
        },
        // 获取列表
        async getDeptList() {
            let res = await getDeptList(this.form)
            this.deptList = res.data.data
            // this.pagination.totalCount = totalCount
        },
        handleChartModelChange() {
            this.$nextTick(() => {
                this.myBarCharts_1.resize();
                this.lineCharts_1.resize();
                // this.pieChart_1.resize()
                // this.pieChart_2.resize()
                // this.pieChart_3.resize()
            })
        },
        async getProjectYear() {
            let user = localStorage.getItem('admin.user')
            let res = await getProjectYear({ deptID: this.deptID })
            this.years = [...res.data.data]
            this.year = res.data.data[0]
        },
        initPieChart(data, id, key, title) {
            var chartDom = document.getElementById(id);
            this[id] = echarts.init(chartDom);
            let datas = data.map(item => {
                return {
                    value: item[key],
                    name: item.label,
                }
            })
            var option = {
                tooltip: {
                },
                title: {
                    text: title,
                    show: true,
                    left: "center",
                    textStyle: {
                        fontSize: 14
                    }
                },
                series: [
                    {
                        type: 'pie',
                        data: datas
                        // data: [
                        //   { value: 40, name: '推荐', itemStyle: { color: '#70AD47' } },
                        //   { value: 10, name: '放弃', itemStyle: { color: '#ED7D31' } },
                        //   { value: 30, name: '待定', itemStyle: { color: '#A5A5A5' } },
                        //   { value: 20, name: '其他', itemStyle: { color: '#FFC000' } }
                        // ]
                    }
                ]
            };
            this[id].setOption(option);
        },
        initLineCharts_1(data) {
            const chartDom = document.getElementById('employeeCharts');
            this.lineCharts_1 = echarts.init(chartDom);
            const option = {
                title: {
                    text: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: '0%',
                    right: '0%',
                    bottom: '0%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: data.map(item => item.userName),
                    axisLabel: {
                        rotate: 45, // 将标签旋转45度
                        interval: 0  // 显示所有标签，如果标签过多可以适当调整
                    }
                },
                yAxis: {
                    type: 'value',
                    max: Math.max(...data.map(item => item.number)) + 2
                },
                dataZoom: [
                    {
                        type: 'inside', // 使用 inside 类型
                        start: 0,
                        end: 100,
                        zoomLock: false // 允许拖拽
                    }
                ],
                series: [
                    {
                        data: data.map(item => item.number),
                        type: 'line',
                        smooth: true,
                        lineStyle: {
                            color: 'rgb(145,204,117)',
                            width: 3
                        },
                        itemStyle: {
                            color: 'rgb(145,204,117)',
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        areaStyle: {
                            color: 'rgba(79, 141, 249, 0.2)'
                        },
                        label: {
                            show: true,
                            position: 'top',
                            color: '#666'
                        }
                    }
                ]
            };
            this.lineCharts_1.setOption(option);
        }
        ,
        initBarChart(data) {
            var chartDom = document.getElementById('barAnalysisCharts');
            this.myBarCharts_1 = echarts.init(chartDom);
            // let undoneData = data.map((item, idx) => {
            //     return {
            //         value: item.undone,
            //         itemStyle: {
            //             color: 'rgb(84,112,198)'
            //         }
            //     }
            // })
            // let totalData = data.map((item, idx) => {
            //     return {
            //         value: item.total,
            //         itemStyle: {
            //             color: 'rgb(250,200,88)'
            //         }
            //     }
            // })
            let datas = data.map((item, idx) => {
                return {
                    value: item.number,
                    itemStyle: {
                        color: 'rgb(145,204,117)'
                    }
                }
            })
            var option = {
                title: {
                    text: '',
                    left: 'center',
                    show: false
                },
                tooltip: {
                    trigger: 'item'
                },
                // legend: {
                //     data: [
                //         {
                //             name: "未完成",
                //         },
                //         {
                //             name: "已完成",
                //         },
                //         {
                //             name: "总数",
                //         }
                //     ]
                // },
                dataZoom: [
                    {
                        type: 'inside', // 使用 inside 类型
                        start: 0,
                        end: 100,
                        zoomLock: false // 允许拖拽
                    }
                ],
                grid: {
                    left: '0%',
                    right: '0%',
                    bottom: '0%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: data.map(item => item.userName),
                    axisLabel: {
                        interval: 0,
                        rotate: 0
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: datas,
                        type: 'bar',
                        barWidth: '20%'
                    },
                    // {
                    //     name: "已完成",
                    //     data: doneData,
                    //     type: 'bar',
                    //     barWidth: '20%'
                    // },
                    // {
                    //     name: "总数",
                    //     data: totalData,
                    //     type: 'bar',
                    //     barWidth: '20%'
                    // }
                ]
            };
            this.myBarCharts_1.off('click')
            this.myBarCharts_1.on('click', (params) => {
                // params 是一个包含了点击事件信息的对象
                // params.dataIndex 是点击的柱子的索引
                // params.name 是点击的柱子的系列名称
                console.log(params);
                // params.value 是点击的柱子的值
                // params.componentType 表明事件发生的组件类型，这里是 'series'
                if (!['未知'].includes(this.year)) {
                    this.$router.push({
                        path: "/project",
                        query: {
                            year: this.year,
                            month: params.name
                        }
                    })
                }
                // 在这里执行你需要的操作，比如弹出提示框、跳转到其他页面等
            });
            this.myBarCharts_1.setOption(option);
        },
        async getEpAnalyse() {
            let params = {
                "projectID": this.projectID
            }
            let res = await getEpAnalyse(params)
            this.detail = res.data.data
            this.initBarChart(res.data.data)
            this.initLineCharts_1(res.data.data);
            // this.initPieChart(res.data.data, 'pieChart_1', 'total', '总数')
            // this.initPieChart(res.data.data, 'pieChart_2', 'done', '已完成')
            // this.initPieChart(res.data.data, 'pieChart_3', 'undone', '未完成')
        }
    }
}
</script>

<style scoped lang="less">
.new-page {
    height: 100%;
    background-color: @base-bg-color;
    border-radius: 4px;

    //margin-top: -24px;
    h1 {
        font-size: 48px;
    }
}

.statistics {
    padding: 24px;
    border-radius: 8px;
    margin-top: 16px;
    border: solid 1px #eeeeee;

    .header {
        h1 {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 22px;
        }

        .item {
            display: flex;
            align-items: center;
            width: 350px;

            .label {
                color: #757575;
                width: 110px;
            }
        }
    }

}

.choose {
    display: flex;
    gap: 20px;
}

.content {
    display: flex;
    margin-top: 8px;
    gap: 8px;

    .left {
        width: 300px;
        background-color: #fff;
        border-radius: 8px;
        padding: 32px;
        overflow: auto;
        height: 640px;
    }
    h1 {
    }
    ul {
        padding: 0;
    }
    li {
        list-style: none;
        cursor: pointer;
        width: 100%;
        margin-bottom: 12px;
        border-bottom: 1px solid #d8d8d8;
        padding-bottom: 12px;
    }
}

.chart-box {
    flex: 1;
    height: 640px;

    .card {
        background-color: #fff;
        border-radius: 8px;
        width: 100%;
        padding: 32px;
        box-sizing: border-box;
        height: 640px;

        h1 {
            font-weight: bold;
        }
    }
}

.active {
    color: #13c2c2;
}

.pie {
    display: flex;
    gap: 8px;
}

.pieChart {
    width: 33%;
    height: 400px;
}

.chart {
    width: 100%;
    height: 544px;
}
</style>