<template>
  <div>
    <div class="new-page statistics">
      <div class="header">
        <h1>项目统计</h1>
        <div class="choose">
          <div class="item">
            <div class="label">选择年份：</div>
            <a-select placeholder="请选择" v-model="projectYear" style="width: 100%;" @change="handleChange">
              <a-select-option :value="item" v-for="item in years" :key="item">{{ item }}</a-select-option>
            </a-select>
          </div>
          <div class="item">
            <div class="label">切换图表：</div>
            <a-select placeholder="请选择" @change="handleChartModelChange" v-model="chartModel"
              style="width: 100%;">
              <a-select-option :value="item.value" v-for="item in chartList" :key="item.value">{{ item.label
                }}</a-select-option>
            </a-select>
          </div>
        </div>

      </div>
    </div>
    <div class="chart-box">
      <div class="card" v-show="chartModel === 0">
        <h1>折线图</h1>
        <div class="chart" id="employeeChart"></div>
      </div>
      <div class="card" v-show="chartModel === 1">
        <h1>柱状图</h1>
        <div class="chart" id="barAnalysisChart"></div>
      </div>
      <div class="card" v-show="chartModel === 2">
        <h1>饼图</h1>
        <div class="pie">
          <div class="pieChart" id="pieChart1"></div>
          <div class="pieChart" id="pieChart2"></div>
          <div class="pieChart" id="pieChart3"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProjectCount, getProjectYear } from '@/services/project'
import * as echarts from 'echarts';
import { mapState } from 'vuex'
export default {
  name: 'Demo',
  i18n: require('./i18n'),
  data() {
    return {
      years: [

      ],
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
        {
          label: "饼图",
          value: 2
        }
      ],
      projectYear: "",
      myBarChart: null,
      lineChart: null,
      pieChart1: null,
      pieChart2: null,
      pieChart3: null
    }
  },
  computed: {
    ...mapState('setting', ['pageMinHeight']),
    desc() {
      return this.$t('description')
    }
  },
  mounted() {
    // this.initLineChart();

  },
  activated() {
    this.getProjectYear().then(() => {
      this.getProjectCount()
    })

  },
  methods: {
    handleChange() {
      this.getProjectCount()
    },
    handleChartModelChange() {
      this.$nextTick(() => {
        this.myBarChart.resize();
        this.lineChart.resize();
        this.pieChart1.resize()
        this.pieChart2.resize()
        this.pieChart3.resize()
      })
    },
    async getProjectYear() {
      let user = localStorage.getItem('admin.user')
      let deptID = JSON.parse(user).id
      let res = await getProjectYear({ deptID })
      this.years = [...res.data.data, "全部"]
      this.projectYear = "全部"
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
    initLineChart(data) {
      const chartDom = document.getElementById('employeeChart');
      this.lineChart = echarts.init(chartDom);
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
      this.lineChart.setOption(option);
    },
    initBarChart(data) {
      var chartDom = document.getElementById('barAnalysisChart');
      this.myBarChart = echarts.init(chartDom);
      let undoneData = data.map((item, idx) => {
        return {
          value: item.undone,
          itemStyle: {
            color: 'rgb(84,112,198)'
          }
        }
      })
      let totalData = data.map((item, idx) => {
        return {
          value: item.total,
          itemStyle: {
            color: 'rgb(250,200,88)'
          }
        }
      })
      let doneData = data.map((item, idx) => {
        return {
          value: item.done,
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
        grid: {
          left: '0%',
          right: '0%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.label),
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
            name: "未完成",
            data: undoneData,
            type: 'bar',
            barWidth: '20%'
          },
          {
            name: "已完成",
            data: doneData,
            type: 'bar',
            barWidth: '20%'
          },
          {
            name: "总数",
            data: totalData,
            type: 'bar',
            barWidth: '20%'
          }
        ]
      };
      this.myBarChart.off('click')
      this.myBarChart.on('click', (params) => {
        // params 是一个包含了点击事件信息的对象
        // params.dataIndex 是点击的柱子的索引
        // params.name 是点击的柱子的系列名称
        console.log(params);
        // params.value 是点击的柱子的值
        // params.componentType 表明事件发生的组件类型，这里是 'series'
        if (!['未知'].includes(this.projectYear)) {
          this.$router.push({
            path: "/project",
            query: {
              year: this.projectYear,
              month: params.name
            }
          })
        }
        // 在这里执行你需要的操作，比如弹出提示框、跳转到其他页面等
      });
      this.myBarChart.setOption(option);
    },
    async getProjectCount() {
      let projectYear = ""
      if (this.projectYear == '未知') {
        projectYear = "1000"
      } else if (this.projectYear == '全部') {
        projectYear = ""
      } else {
        projectYear = this.projectYear
      }
      let params = {
        projectYear
      }
      let res = await getProjectCount(params)
      this.initBarChart(res.data.data)
      this.initLineChart(res.data.data);
      this.initPieChart(res.data.data, 'pieChart1', 'total', '总数')
      this.initPieChart(res.data.data, 'pieChart2', 'done', '已完成')
      this.initPieChart(res.data.data, 'pieChart3', 'undone', '未完成')
    }
  }
}
</script>

<style scoped lang="less">
@import "index";

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
</style>