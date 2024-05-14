<template>
  <div class="new-page statistics" :style="`min-height: ${pageMinHeight}px`">
    <div class="header">
      <h1>出差定位分布</h1>
      <a>刷新</a>
    </div>
    <China :height="600"/>
  </div>
</template>

<script>
import China from '@/components/chart/China'
import { mapState } from 'vuex'
export default {
  name: 'Demo',
  i18n: require('./i18n'),
  components: {China},
  data() {
    return {
    }
  },
  computed: {
    ...mapState('setting', ['pageMinHeight']),
    desc() {
      return this.$t('description')
    }
  }
}
</script>

<style scoped lang="less">
@import "index";

.statistics {
  padding: 24px;
  background-color: rgb(0,10,52);
  height: 100vh;
  .header {
    display: flex;
    justify-content: space-between;
  }

  h1 {
    font-size: 18px;
    font-weight: bold;
    padding-left: 14px;
    color: #fff;
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