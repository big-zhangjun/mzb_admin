<template>
    <div class="map" ref="echartsRef"></div>
</template>

<script>
import * as echarts from 'echarts';
import AMapLoader from '@amap/amap-jsapi-loader';
import { getUserLocation } from "@/services/user"
export default {
    name: 'EChartsComponent',
    data() {
        return {
            myChart: null,
            dataValue: [
                // {
                //     "value": [114.271522, 22.753644],
                //     "Sales": "2台",
                //     "text": "机器人1"
                // },
                // {
                //     "value": [118.46, 32.02],
                //     "Sales": "2台",
                //     "text": "机器人1"
                // },
                // {
                //     "value": [106.54, 29.59],
                //     "Sales": "1台",
                //     "text": "机器人1"
                // },
                // {
                //     "value": [116.24, 39.55],
                //     "Sales": "3台",
                //     "text": "机器人1"
                // },
                // {
                //     "value": [113.41, 29.59],
                //     "Sales": "2台",
                //     "text": "机器人1"
                // }
            ]
        }
    },
    props: {
        fontSize: {
            type: String,
            default: "7"
        },
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
        // 根据经纬度得到当前所属城市
        async getLocation({ longitude, latitude }, callback) {
            window._AMapSecurityConfig = {
                securityJsCode: "f209553e4d940456fb3eb40ecd10bbf6",
            };
            try {
                // 加载高德地图 API
                const AMap = await AMapLoader.load({
                    key: '74ee337f5bd92559399ccd7b5bb85caf', // 你的 API Key
                    version: '2.0', // 高德地图 API 版本
                    plugins: ['AMap.Geocoder'] // 加载 Geocoder 插件
                });

                const geocoder = new AMap.Geocoder({
                    // 设置 Geocoder 配置
                });

                // 调用 geocode 方法
                geocoder.getAddress([longitude, latitude], (status, result) => {
                    if (status === 'complete' && result.regeocode) {
                        callback(result.regeocode.addressComponent)
                    } else {
                        console.error('获取省份信息失败', result);
                    }
                });
            } catch (error) {
                console.error('加载高德地图 API 失败', error);
            }
        },
        async getUserLocation() {
            const res = await getUserLocation({ deptID: 51, resign: 2 })
            return res.data.data
        },
        async initECharts() {
            let res = await this.getUserLocation()
            let employeeData = res.filter(item => item.longitude)
            let idx = 0;
            let list = []
            employeeData.forEach(item => {
                this.getLocation(item, (res) => {
                    const result = res;
                    idx++
                    list.push({ ...result, ...item })
                    if (idx == employeeData.length) {
                        let grouped = list.reduce((acc, current) => {
                            let province = current.province;
                            if (!acc[province]) {
                                acc[province] = [];
                            }
                            acc[province].push(current);
                            return acc;
                        }, {});
                        this.dataValue = Object.keys(grouped).map(province => {
                            let groupedByCity = grouped[province].reduce((acc, curr) => {
                                if (!acc[curr.city]) {
                                    acc[curr.city] = [];
                                }
                                acc[curr.city].push(curr);
                                return acc;
                            }, {});
                            let groupedByCityArray = Object.keys(groupedByCity).map(city => {
                                return {
                                    city,
                                    data: groupedByCity[city]
                                };
                            });

                            return {
                                province: province,
                                result: groupedByCityArray,
                                value: [grouped[province][0].longitude, grouped[province][0].latitude]
                            }
                        });
                        console.log(this.dataValue, 'grouped');
                        this.$emit("setTableList", this.dataValue)
                        let chartDom = this.$refs.echartsRef;
                        echarts.registerMap('china', require('./china.json'));
                        this.myChart = echarts.init(chartDom);
                        var option = {
                            //设置一个标题
                            title: {
                                text: '',
                                x: 'center',
                                textStyle: {
                                    color: '#fff',
                                    fontSize: "40"
                                }
                            },

                            //鼠标划过省份下弹框
                            tooltip: {
                                show: true,
                            },
                            geo: {
                                map: "china",
                                show: true,
                                roam: true,
                                zoom: 1.3,//地图缩放比例
                                center: [105, 30],//地图位置
                                itemStyle: {
                                    // 地图区域的颜色
                                    areaColor: "#71d5a1", // 绿色
                                    // 图形的描边颜色
                                    borderColor: "#2979ff", // 蓝色
                                },
                                label: {
                                    normal: {
                                        show: true,
                                        fontSize: this.fontSize,
                                        color: "rgb(255,255,153)"
                                    }
                                },
                                emphasis: {
                                    // 设置区域样式
                                    itemStyle: {
                                        areaColor: "#ffff99", // 黄色
                                        borderColor: "#f29100", // 描边颜色黄色
                                    },
                                    // 设置字体
                                    label: {
                                        fontSize: 16, // 16px
                                        color: "#f29100", // 黄色
                                    },
                                },

                            },

                            series: [
                                //我们的散点
                                {
                                    type: "map",
                                    map: "china",
                                    geoIndex: 0,
                                    roam: true,
                                },
                                {
                                    name: '点',
                                    type: 'scatter',
                                    coordinateSystem: 'geo',
                                    zlevel: 6,
                                    itemStyle: {
                                        color: "red",
                                        shadowColor: "red"
                                    }
                                },
                                //涟漪特效
                                {

                                    name: "产品销量",
                                    type: "effectScatter",
                                    coordinateSystem: "geo",
                                    data: this.dataValue,//传入的地图点数据
                                    symbolSize: 12,//涟漪大小
                                    showEffectOn: "render",
                                    //涟漪效应
                                    rippleEffect: {
                                        brushType: "stroke",
                                        color: "red",
                                        period: 10,//周期
                                        scale: 4//规模
                                    },
                                    hoverAnimation: true,//悬停动画
                                    //地图点样式
                                    label: {
                                        formatter: "{b}",
                                        position: "top",
                                        show: true,
                                        fontSize: "10",
                                    },
                                    itemStyle: {
                                        color: "#f13434",
                                        shadowBlur: 2,
                                        shadowColor: "#333"
                                    },
                                    //鼠标点击散点的下弹框
                                    tooltip: {
                                        show: true,
                                        triggerOn: "click",
                                        formatter: function (data1) {
                                            let list = data1.data.result
                                            let str = ""
                                            list.forEach(data => {
                                                let item = data.data[0]
                                                str += `<div class="custom-tooltip" style="margin-bottom: 12px">
                                                        <div class="round"><b>姓名</b>: ${item.userName}<br /><b>日期</b>: ${item.blogDate}<br /><b>地址</b>: ${item.address}</div>
                                                    </div>`
                                            })
                                            return str
                                        }
                                    },
                                    zlevel: 1
                                }
                            ]
                        }
                        // 使用刚指定的配置项和数据显示图表。  
                        this.myChart.setOption(option);
                    }
                })

            })
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