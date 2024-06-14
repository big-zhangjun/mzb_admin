<template>
  <div class="new-page statistics" :style="`min-height: ${pageMinHeight}px`">
    <div class="header">
      <h1>出差定位分布</h1>
      <a @click="resetData">刷新</a>
    </div>
    <China ref="chinaMap" :height="600" @setTableList="setTableList" :fontSize="'11.5'"/>
    <div class="table">
      <table border="1" width="200px">
        <tr style="text-align: center;font-weight: bold;">
          <td>地区</td>
          <td>数量</td>
        </tr>
        <tr style="text-align: center;" v-for="(item, idx) in tableList" :key="idx">
          <td>{{ item.province }}</td>
          <td>{{ item.result.length }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import China from '@/components/chart/China'
import { mapState } from 'vuex'
export default {
  name: 'Demo',
  components: { China },
  data() {
    return {
      tableList: []
    }
  },
  computed: {
    ...mapState('setting', ['pageMinHeight']),
    desc() {
      return this.$t('description')
    }
  },
  methods: {
    resetData() {
      this.$refs.chinaMap.initECharts().then(res => {
        this.$message.success("刷新成功")
      })
    },
    setTableList(list) {
      this.tableList = list
    }
  }
}
</script>

<style scoped lang="less">
.statistics {
  padding: 24px;
  // background-color: rgb(6, 8, 18);
  height: calc(100vh - 130px);

  .table {
    position: absolute;
    right: 10px;
    top: 0;
    box-shadow: 0 6px 6px rgba(0,0,0,.05);
    background-color: #fff;
    padding: 12px;
    border-radius: 4px;
  }

  .header {
    display: flex;
    justify-content: space-between;
  }

  a {
    color: #13c2c2;
    display: none;
  }

  h1 {
    font-size: 18px;
    font-weight: bold;
    padding-left: 14px;
    color: #121b1b;
    position: relative;

    &::before {
      content: "";
      display: block;
      width: 4px;
      height: 20px;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      background-color: #13c2c2;
      border-radius: 4px;
      position: absolute;
    }
  }
}
</style>