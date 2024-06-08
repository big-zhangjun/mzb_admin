<template>
    <div class="card">
        <div class="map" id="employeeCharts"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import { getProjectCount } from "@/services/project"
export default {
    name: 'EChartsComponent',
    data() {
        return {
            myLineChart: null
        }
    },
    activated() {
        this.getProjectCount()
    },
    mounted() {
    },
    methods: {
        async getProjectCount() {
            let params = {
                year: ""
            }
            let res = await getProjectCount(params)
            this.initLineChart(res.data.data);
        },
        initLineChart(data) {
            const chartDom = document.getElementById('employeeCharts');
            this.myLineChart = echarts.init(chartDom);
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
                    data: data.map(item => item.label)
                },
                yAxis: {
                    type: 'value',
                    max: Math.max(...data.map(item => item.total)) + 20
                },
                legend: {
                    data: [
                        {
                            name: "未完成",
                        },
                        {
                            name: "已完成",
                        },
                        {
                            name: "总数",
                        }
                    ]
                },
                series: [
                    {
                        name: "已完成",
                        data: data.map(item => item.done),
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
                    },
                    {
                        name: "总数",
                        data: data.map(item => item.total),
                        type: 'line',
                        smooth: true,
                        lineStyle: {
                            color: 'rgb(250,200,88)',
                            width: 3
                        },
                        itemStyle: {
                            color: 'rgb(250,200,88)',
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
                    },
                    {
                        name: "未完成",
                        data: data.map(item => item.undone),
                        type: 'line',
                        smooth: true,
                        lineStyle: {
                            color: '#4f8df9',
                            width: 3
                        },
                        itemStyle: {
                            color: '#4f8df9',
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
                    },
                ]
            };
            this.myLineChart.setOption(option);
        }

    },
    deactivated() {
        this.myLineChart.dispose()
    },
};
</script>
<style lang="less" scoped>
.card {
    padding: 20px;
}

.map {
    position: absolute;
    width: calc(100% - 40px);
    height: calc(100% - 100px);

    ::v-deep .round {
        position: relative;
        padding-left: 20px;

        &::after {
            content: "";
            display: block;
            position: absolute;
            width: 10px;
            height: 10px;
            background: #13c2c2;
            left: 0;
            top: 50%;
            border-radius: 50%;
            transform: translateY(-50%);
        }

        &:nth-child(2) {
            &::after {

                background: rgb(114, 46, 209);
            }
        }

        &:nth-child(3) {
            &::after {

                background: rgb(62, 175, 124)
            }
        }
    }
}
</style>
<style></style>