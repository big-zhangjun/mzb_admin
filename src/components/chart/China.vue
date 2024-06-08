<template>
    <div class="map" ref="echartsRef"></div>
</template>

<script>
import * as echarts from 'echarts';
import { getUserLocation } from "@/services/user"
export default {
    name: 'EChartsComponent',
    data() {
        return {
            myChart: null
        }
    },
    props: {
        geo: {
            type: Object,
            default: () => {
                return {
                    show: true,
                    map: 'china',
                    roam: true, // 是否开启鼠标缩放移动和平移漫游
                    aspectScale: 0.75, //参数用于 scale 地图的长宽比。
                    // layoutCenter: ['50%', '51.5%'], //地图位置
                    // layoutSize: '110%', //地图的大小
                    label: {
                        show: false,
                        color: '#fff',
                    },
                    itemStyle: {
                        normal: {
                            borderColor: 'rgba(147, 235, 248, 1)',
                            borderWidth: 1,
                            areaColor: {
                                type: 'radial',
                                x: 0.5,
                                y: 0.5,
                                r: 0.8,
                                colorStops: [{
                                    offset: 0,
                                    color: 'rgba(147, 235, 248, 0)' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: 'rgba(147, 235, 248, .2)' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                            shadowColor: 'rgba(128, 217, 248, 1)',
                            // shadowColor: 'rgba(255, 255, 255, 1)',
                            shadowOffsetX: -2,
                            shadowOffsetY: 2,
                            shadowBlur: 10
                        },
                        emphasis: {
                            areaColor: '#389BB7',
                            borderWidth: 0
                        }
                    }
                }
            }
        },
        color: {
            type: String,
            default: "#fff"
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initECharts();
            setTimeout(() => {
                this.myChart.resize();
            }, 200);
            window.onresize = () => {
                this.myChart.resize();
            };
        })
    },
    methods: {
        async getUserLocation() {
            const res = await getUserLocation({ deptID: 51 })
            return res.data.data
        },
        async initECharts() {
            let that = this
            let res = await this.getUserLocation()
            let employeeData = res.filter(item => item.longitude)
            // const employeeData = [
            //     {
            //         "id": 221,
            //         "userName": "张俊",
            //         "nickName": "张俊",
            //         "deptName": "电控部",
            //         "avatar": "./pic/avatar/20240510165740.png",
            //         "longitude": 121.44297,
            //         "latitude": 28.67307,
            //         "blogDate": "2024-05-13T00:00:00+08:00"
            //     },
            //     {
            //         userName: '李四',
            //         longitude: 118.426143,
            //         latitude: 31.19967
            //     }
            // ]
            let chartDom = this.$refs.echartsRef;
            echarts.registerMap('china', require('./china.json'));
            this.myChart = echarts.init(chartDom);
            var option = {
                title: {
                    text: '',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item', // 触发类型，默认数据触发，可选为：'item'、'axis'  
                    formatter: function (params) {
                        // params 是一个包含当前数据点信息的数组  
                        // 通常包含 seriesName（系列名称）、data（数据值）、dataIndex（数据索引）等信息  

                        // 自定义提示框的内容  
                        var htmlContent = '<div class="custom-tooltip">';
                        htmlContent += '<div class="round">姓名: ' + params.name + '</div>';
                        htmlContent += '<div class="round">日期: ' + params.value[2] + '</div>';
                        htmlContent += '<div class="round">地址: ' + params.value[3] + '</div>';
                        // 如果你的数据项还有其他属性，也可以在这里展示  
                        // 例如：htmlContent += '<p>其他信息: ' + params[0].data.otherInfo + '</p>';  

                        // 如果你的图表有多个数据系列并且你想要展示所有系列的信息  
                        // 你可以遍历 params 数组来构建内容  
                        // params.forEach(function (param) {  
                        //     htmlContent += '<p>' + param.seriesName + ': ' + param.value + '</p>';  
                        // });  

                        htmlContent += '</div>';

                        // 返回自定义的 HTML 内容  
                        return htmlContent;
                    },
                },
                geo: this.geo,
                series: [
                    {
                        name: '员工分布',
                        type: 'scatter', // 图表类型为散点图  
                        coordinateSystem: 'geo', // 使用地理坐标系  
                        data: employeeData.map(function (item) { // 假设employeeData是一个包含经纬度和员工信息的数组  
                            return {
                                name: item.userName, // 员工姓名，用于tooltip显示  
                                value: [item.longitude, item.latitude, item.blogDate, item.address], // 经纬度坐标  
                                label: { // 散点标签  
                                    show: true,
                                    textStyle: { // 文本样式设置  
                                        color: that.color, // 设置为金色  
                                        borderColor: 'transparent', // 取消描边，设置为透明  
                                        borderWidth: 0 // 边框宽度设置为0，进一步确保没有描边  
                                    },
                                    formatter: '{b}' // 显示员工姓名  
                                },
                            };
                        }),
                        symbolSize: function (val) { // 散点大小  
                            return val[2] / 10; // 假设每个员工数据还有一个表示大小的字段，这里简化为直接返回固定值  
                        },
                        label: {
                            formatter: '{b}' // 标签内容格式，这里显示员工姓名  
                        },
                        emphasis: { // 高亮状态  
                            label: {
                                show: true
                            }
                        },
                        itemStyle: {
                            color: that.color // 散点颜色  
                        },
                        zlevel: 1 // 控制图形的前后顺序  
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。  
            this.myChart.setOption(option);
            // 基于准备好的dom，初始化echarts实例  
        },
        convertISOToDateString(isoString) {
            // 创建一个新的Date对象  
            const date = new Date(isoString);

            // 验证日期是否有效  
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date string');
            }

            // 使用Date对象的方法获取年、月、日，并组合成新的字符串  
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() 返回的是从0开始的月份，所以需要+1，并使用padStart确保总是两位数  
            const day = String(date.getDate()).padStart(2, '0'); // getDate() 返回的是日期（1-31），使用padStart确保总是两位数  

            // 返回格式为 "YYYY-MM-DD" 的字符串  
            return `${year}-${month}-${day}`;
        }

    }
};
</script>
<style lang="less" scoped>
.map {
    position: absolute;
    width: 100%;
    height: calc(100% - 40px);
    min-height: 400px;

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