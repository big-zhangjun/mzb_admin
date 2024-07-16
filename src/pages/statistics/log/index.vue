<template>
    <div>
        <div class="new-page statistics">
            <div class="header">
                <div class="choose">
                    <div class="item">
                        <div class="label">选择年份：</div>
                        <a-select placeholder="请选择" v-model="year" style="width: 100%;" @change="handleChange">
                            <a-select-option :value="item" v-for="item in years" :key="item">{{ item
                                }}</a-select-option>
                        </a-select>
                    </div>
                    <div class="item">
                        <div class="label">选择月份：</div>
                        <a-select placeholder="请选择" v-model="month" style="width: 100%;" @change="handleMonthChange">
                            <a-select-option :value="item" v-for="item in months" :key="item">{{ item
                                }}</a-select-option>
                        </a-select>
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
                        <div class="label">切换部门：</div>
                        <a-select placeholder="请选择" @change="handleChange" v-model="deptID" style="width: 100%;">
                            <a-select-option :value="item.id" v-for="item in deptList" :key="item.id">{{
                                item.deptName
                            }}</a-select-option>
                        </a-select>
                    </div>
                    <div class="item">
                        <div class="label">在职离职：</div>
                        <a-select style="width: 100%;" placeholder="请选择" v-model="resign" @change="handleChange">
                            <a-select-option :value="2">在职</a-select-option>
                            <a-select-option :value="1">离职</a-select-option>
                            <a-select-option :value="0">全部</a-select-option>
                        </a-select>
                    </div>
                </div>

            </div>
        </div>
        <div class="chart-box">
            <div class="card" v-show="chartModel === 0">
                <div class="chart" id="employeeChartLog"></div>
            </div>
            <div class="card" v-show="chartModel === 1">
                <div class="chart" id="barAnalysisChartLog"></div>
            </div>
        </div>
        <a-modal v-model="visible" title="日志统计" @ok="handleOk" :width="1000" class="modal">
            <calendar :userID="userID" ref="calendar"/>
        </a-modal>
    </div>
</template>

<script>
import { getProjectBlogCount, getProjectYear } from '@/services/project'
import { getDeptListS } from '@/services/user'
import calendar from "@/pages/statistics/components/calendar.vue"
import * as echarts from 'echarts';
import { mapState } from 'vuex'
export default {
    name: 'Log',
    components: { calendar },
    data() {
        return {
            years: [

            ],
            visible: false,
            resign: 2,
            deptID: 51,
            deptList: [],
            chartModel: 0,
            userID: 0,
            chartList: [
                {
                    label: "折线图",
                    value: 0
                },
                {
                    label: "柱状图",
                    value: 1
                },
``            ],
            year: "",
            month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
            months: [
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
            myBarCharts11: null,
            lineCharts11: null,
        }
    },
    computed: {
        ...mapState('setting', ['pageMinHeight']),
        desc() {
            return this.$t('description')
        }
    },
    mounted() {
        // this.initLineCharts11();

    },
    activated() {
        this.getProjectYear().then(async () => {
            await this.getDeptListS()
            this.getProjectBlogCount()
        })

    },
    deactivated() {
        this.myBarCharts11.dispose()
        this.lineCharts11.dispose()
    },
    methods: {
        handleOk() { },
        handleChange() {
            this.getProjectBlogCount()
        },
        handleMonthChange() {
            this.getProjectBlogCount()
        },
        // 获取列表
        async getDeptListS() {
            let res = await getDeptListS(this.form)
            this.deptList = res.data.data
        },
        handleChartModelChange() {
            this.$nextTick(() => {
                this.myBarCharts11.resize();
                this.lineCharts11.resize();
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
                    userID: item.userID,
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
        initLineCharts11(data) {
            const chartDom = document.getElementById('employeeChartLog');
            this.lineCharts11 = echarts.init(chartDom);
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
            this.lineCharts11.off('click')
            this.lineCharts11.on('click', (params) => {
                console.log(params, 'parans');
                if (!['未知'].includes(this.year)) {
                    this.visible = true
                    this.userID = data[params.dataIndex].userID
                    this.$nextTick(()=>{
                        this.$refs.calendar.initData()
                    })
                }
            });
            this.lineCharts11.setOption(option);
        }
        ,
        initBarChart(data) {
            var chartDom = document.getElementById('barAnalysisChartLog');
            this.myBarCharts11 = echarts.init(chartDom);
            let datas = data.map((item, idx) => {
                return {
                    value: item.number,
                    userID: item.userID,
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
                ]
            };
            this.myBarCharts11.off('click')
            this.myBarCharts11.on('click', (params) => {
                if (!['未知'].includes(this.year)) {
                    this.visible = true
                    this.userID = params.data.userID
                    this.$nextTick(()=>{
                        this.$refs.calendar.initData()
                    })
                }
            });
            this.myBarCharts11.setOption(option);
        },
        async getProjectBlogCount() {
            let projectYear = ""
            if (this.year == '未知') {
                projectYear = "1000"
            } else {
                projectYear = this.year
            }
            let params = {
                year: projectYear,
                month: this.month == "全部" ? "" : this.month,
                deptID: this.deptID,
                resign: this.resign
            }
            let res = await getProjectBlogCount(params)
            this.initBarChart(res.data.data)
            this.initLineCharts11(res.data.data);
            // this.initPieChart(res.data.data, 'pieChart11', 'total', '总数')
            // this.initPieChart(res.data.data, 'pieChart22', 'done', '已完成')
            // this.initPieChart(res.data.data, 'pieChart33', 'undone', '未完成')
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

.chart-box {
    margin-top: 8px;

    .card {
        background-color: #fff;
        border-radius: 8px;
        width: 100%;
        padding: 32px;
        box-sizing: border-box;

        h1 {
            font-weight: bold;
        }
    }
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
    height: 400px;
}

.modal {
    ::v-deep .ant-modal-body {
        background-color: rgb(246, 247, 248);
        padding: 12px;
    }
}
</style>