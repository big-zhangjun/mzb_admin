<template>
  <div class="new-page statistics" :style="`min-height: ${pageMinHeight}px`">
    <div class="header">
      <h1>出差定位分布</h1>
      <a @click="resetData">刷新</a>
    </div>
    <China ref="chinaMap" :height="600" @setTableList="setTableList" :fontSize="'11.5'" />
    <div class="table">
      <div class="cards">
        <div class="header">
          <div class="item city">地区</div>
          <div class="item" style="color: #12151b;">人员</div>
        </div>
        <div v-for="(item, idx) in tableList" :key="idx">
          <div class="content" v-for="_item in item.result">
            <div class="item city">{{ _item.city || item.province }}</div>
            <div class="item">{{ getRealName(_item) }}</div>
          </div>
        </div>
      </div>
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
    getRealName(item) {
      return item.data.map(item => item.realName).join("，")
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
    box-shadow: 0 6px 6px rgba(0, 0, 0, .05);
    background-color: #fff;
    padding: 12px;
    border-radius: 4px;

    .cards {
      .type {
        gap: 10px;
        display: flex;

        .item {
          width: 36px;
          text-align: center;
          line-height: 36px;
          border-radius: 4px;
          border: solid 1px #e2e2e2;
        }

        .active {
          background-color: rgb(54, 98, 233);
          color: #fff;
          border: none;
        }
      }

      .header,
      .content {
        display: flex;
        border: solid rgb(216, 216, 216) 1px;
        border-right: none;

        .item {
          width: 70%;
          text-align: center;
          font-weight: bold;
          line-height: 34px;
          border-right: 1px solid rgb(216, 216, 216);
          padding: 0 12px;
          color: rgb(54, 98, 233);
        }

        .city {
          display: flex;
          width: 30%;
          color: #12151b;
          align-items: center;
          justify-content: center;
        }
      }

      .content {
        border-top: none;
        border-right: none;

        .item {
          line-height: 24px;
          padding: 10px 0;
          font-weight: normal;

        }
      }

      width: 300px;
    }
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