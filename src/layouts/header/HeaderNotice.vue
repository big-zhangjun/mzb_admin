<template>
  <a-dropdown :trigger="['click']" v-model="show">
    <div slot="overlay">
      <a-spin :spinning="loading">
        <a-tabs class="dropdown-tabs" :tabBarStyle="{ textAlign: 'center' }" :style="{ width: '297px' }">
          <a-tab-pane tab="通知" key="1">
            <a-list class="tab-pane">
              <a-list-item style="cursor: pointer;" v-for="item in paneList" :key="item.id" @click="goDetail(item)">
                <a-list-item-meta :title="item.content" :description="getDate(item.createTime)">
                  <div class="avatar" slot="avatar">
                    <div class="round" v-if="item.read!=2"></div>
                    <img src="@/assets/img/laba.png" alt="">
                  </div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-tab-pane>
          <!-- <a-tab-pane tab="消息" key="2">
            <a-list class="tab-pane"></a-list>
          </a-tab-pane> -->
          <a-tab-pane tab="待办" key="3">
            <a-list class="tab-pane"></a-list>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </div>
    <span @click="fetchNotice" class="header-notice">
      <a-badge class="notice-badge" :count="total">
        <a-icon :class="['header-notice-icon']" type="bell" />
      </a-badge>
    </span>
  </a-dropdown>
</template>
getMessageList
<script>
import { getMessageList, updateMessageInfo } from "@/services/backend.js"
export default {
  name: 'HeaderNotice',
  data() {
    return {
      loading: false,
      show: false,
      messageList: [],
      total:0 
    }
  },
  computed: {
    paneList() {
      return this.messageList.filter(item => item.type == 1)
    }
  },
  created() {
    this.getMessageList()
  },
  methods: {
    async goDetail(data) {
      let params = {
        id: data.id,
        read: 2
      }
      let res = await updateMessageInfo(params)
      this.$router.push({
        path: data.url
      })
      this.show = false
    },
    async getMessageList() {
      this.loading = true
      let params = {
        "userID": 171,
        "pageSize": 10,
        "pageIndex": 1
      }
      let res = await getMessageList(params)
      this.messageList = [...this.messageList, ...res.data.data.records]
      this.total = res.data.data.totalCount
      this.loading = false
    },
    getDate(originalTime) {
      // 使用Date对象解析时间字符串
      const date = new Date(originalTime);

      // 获取年、月、日、小时、分钟和秒
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份是从0开始的，所以需要+1
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');

      // 格式化为YYYY-MM-DD HH:mm:ss
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    fetchNotice() {
     
    }
  }
}
</script>

<style lang="less" scoped>
.header-notice {
  display: inline-block;
  transition: all 0.3s;

  span {
    vertical-align: initial;
  }

  .notice-badge {
    color: inherit;

    .header-notice-icon {
      font-size: 16px;
      padding: 4px;
    }
  }
}
.avatar {
  width: 30px;
  position: relative;
  height: 30px;
  border-radius: 50%;
  img {
    width: 100%;
  }
  .round {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: red;
    border-radius: 50%;
    right: 0;
    top: 0;
  }
}
.dropdown-tabs {
  background-color: @base-bg-color;
  box-shadow: 0 2px 8px @shadow-color;
  border-radius: 4px;

  .tab-pane {
    padding: 0 24px 12px;
    min-height: 250px;
  }
}
</style>
