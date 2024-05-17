<template>
  <page-layout :avatar="'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png'">
    <div slot="headerContent">
      <div class="title">您好啊，{{ user.userName }}，准备做点什么呢</div>
      <div>{{ user.roleName }} | {{ user.mobile }}</div>
    </div>
    <template slot="extra">
      <!-- <head-info class="split-right" :title="'project'" content="56" />
      <head-info class="split-right" :title="'ranking'" content="8/24" />
      <head-info class="split-right" :title="'visit'" content="2,223" /> -->
    </template>
    <template>
      <a-row style="margin: 0 -12px">
        <a-col style="padding: 0 12px" :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card class="project-list" style="margin-bottom: 24px;" :bordered="false" title="公告信息"
            :body-style="{ padding: 0 }">
            <a slot="extra" @click="goNoticeList">更多</a>
            <div>
              <a-card-grid :key="item.id" v-for="(item, i) in noticeList">
                <a-card @click="goDetail(item)" :bordered="false" :body-style="{ padding: 0 }">
                  <a-card-meta>
                    <div slot="title" class="card-title">
                      <!-- <a-avatar  :src="item.logo" /> -->
                      <div class="content">
                        <div class="left">
                          <span class="title">{{ item.title }}</span>
                          <span class="creator">{{ item.creator }}</span>
                        </div>
                        <div class="right">
                          <img :src="getImg(item)" alt="">
                        </div>
                      </div>
                    </div>
                  </a-card-meta>
                  <div class="project-item">
                    <a class="group">创建时间：{{ item.createTime }}</a>
                    <!-- <a-popconfirm title="确定删除该公告?" ok-text="确定" cancel-text="取消" @confirm="deleteNotice(item, i)">
                      <a>
                        删除
                      </a>
                    </a-popconfirm> -->
                  </div>
                </a-card>
              </a-card-grid>
            </div>
          </a-card>
          <a-card :title="'dynamic'" :bordered="false">
            <a-list>
              <a-list-item :key="index" v-for="(item, index) in activities">
                <a-list-item-meta>
                  <a-avatar slot="avatar" :src="item.user.avatar" />
                  <div slot="title" v-html="item.template" />
                  <div slot="description">9小时前</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
        <a-col style="padding: 0 12px" :xl="8" :lg="24" :md="24" :sm="24" :xs="24">

          <a-card :title="`出差定位分布`" style="margin-bottom: 24px" :bordered="false" :body-style="{ padding: 0 }">
            <div slot="extra">
              <a-button @click="handleUpdate" type="dashed" icon="redo" style="margin-right: 20px;">
                刷新
              </a-button>
              <a @click="handleMore">更多</a>
            </div>
            <div style="min-height: 400px;">
              <China :geo="geo" :color="'#722ed1'" ref="chinaMap" />
            </div>
          </a-card>
        </a-col>
      </a-row>
    </template>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import HeadInfo from '@/components/tool/HeadInfo'
import China from '@/components/chart/China'
import { mapGetters } from 'vuex'
import { getNoticeList, delNoticeInfo } from "@/services/backend"

export default {
  name: 'WorkPlace',
  components: { HeadInfo, PageLayout, China },
  data() {
    return {
      noticeList: [

      ],
      loading: true,
      activities: [],
      teams: [],
      welcome: {
        timeFix: '',
        message: ''
      },
      geo: {
        map: 'china', // 指定地图类型为中国地图  
        roam: true, // 是否开启鼠标缩放和平移漫游  
        label: {
          emphasis: {
            show: false // 省份标签是否显示  
          }
        },
        itemStyle: {
          normal: {
            borderColor: '#ccc', // 省份边界线颜色  
            // areaColor: '#215096',
          },
          emphasis: {
            areaColor: '#999' // 鼠标选中省份的颜色  
          },
        },
      }
    }
  },
  computed: {
    ...mapGetters('account', ['user']),
  },
  created() {
    this.getNoticeList()
  },
  methods: {
    getImg(data) {
      console.log('ss');
      if (!data.cover) {
        let randomNum = Math.floor(Math.random() * 5) + 1;
        let imgs = [
          "1.jpg",
          "2.jpg",
          "3.jpg",
          "4.png",
          "5.png"
        ]
        return require(`@/assets/cover/${imgs[randomNum - 1]}`)
      } else if (data.cover.includes("custom")) {
        return require(`@/assets/cover/${data.cover.split("/")[1]}`)
      } else {
        return process.env.VUE_APP_API_BASE_URL + data.cover.replace(/^\./, '')
      }
    },
    handleUpdate() {
      this.$refs.chinaMap.initECharts().then(res => {
        this.$message.success("刷新成功")
      })
    },
    handleMore() {
      this.$router.push({
        path: "/statistics/trip"
      })
    },
    goDetail(data) {
      this.$router.push({
        path: "/noticeDetail",
        query: {
          id: data.id
        }
      })
    },
    goNoticeList() {
      this.$router.push({
        path: "/notices"
      })
    },
    async getNoticeList() {
      let user = localStorage.getItem('admin.user')
      let userid = JSON.parse(user).id
      let params = {
        "creatorID": userid,
        "updaterID": 0,
        "startTime": "",
        "endTime": "",
        "pageSize": 6,
        "pageIndex": 1
      }
      let res = await getNoticeList(params)
      if (res.data.status.retCode === 0) {
        this.noticeList = res.data.data.records
        console.log(this.noticeList);
      }
    },
    async deleteNotice(data, idx) {
      let params = {
        id: data.id
      }
      let res = await delNoticeInfo(params)
      if (res.data.status.retCode === 0) {
        this.$message.success("删除成功")
        this.noticeList.splice(idx, 1)
      }
    }
  }
}
</script>

<style lang="less">
@import "index";
</style>
