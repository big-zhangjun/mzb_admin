<template>
  <page-layout :avatar="'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png'">
    <div slot="headerContent">
      <div class="title">您好啊，{{ user.userName }}，准备做点什么呢</div>
      <div>{{ user.roleName }} | {{ user.mobile }}</div>
    </div>
    <template slot="extra">
      <head-info class="split-right" :title="'project'" content="56" />
      <head-info class="split-right" :title="'ranking'" content="8/24" />
      <head-info class="split-right" :title="'visit'" content="2,223" />
    </template>
    <template>
      <a-row style="margin: 0 -12px">
        <a-col style="padding: 0 12px" :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card class="project-list" style="margin-bottom: 24px;" :bordered="false" title="公告信息"
            :body-style="{ padding: 0 }">
            <a slot="extra">更多</a>
            <div>
              <a-card-grid :key="i" v-for="(item, i) in projects">
                <a-card :bordered="false" :body-style="{ padding: 0 }">
                  <a-card-meta>
                    <div slot="title" class="card-title">
                      <!-- <a-avatar  :src="item.logo" /> -->
                      <div class="content">
                        <div class="left">
                          <span>{{ item.title }}</span>
                          <span class="creator">{{ item.creator }}</span>
                        </div>
                        <div class="right">
                          <img :src="getImg(item)" alt="">
                        </div>
                      </div>
                    </div>
                  </a-card-meta>
                  <div class="project-item">
                    <a class="group">{{ item.createTime }}</a>
                    <!-- <span class="datetime">9小时前</span> -->
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

          <a-card :title="`当月指数`" style="margin-bottom: 24px" :bordered="false" :body-style="{ padding: 0 }">
            <div style="min-height: 400px;">
              <radar />
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
import Radar from '@/components/chart/Radar'
import { mapGetters } from 'vuex'
import { getNoticeList } from "@/services/backend"
export default {
  name: 'WorkPlace',
  components: { HeadInfo, PageLayout, Radar },
  data() {
    return {
      projects: [

      ],
      loading: true,
      activities: [],
      teams: [],
      welcome: {
        timeFix: '',
        message: ''
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
      if(!data.img) {
        return require("@/assets/cover/1.jpg")
      }
    },
    async getNoticeList() {
      let params = {
        "creatorID": 171,
        "updaterID": 0,
        "startTime": 0,
        "endTime": 0,
        "pageSize": 10,
        "pageIndex": 1
      }
      let res = await getNoticeList(params)
      if (res.data.status.retCode === 0) {
        this.projects = res.data.data.records
        console.log(this.projects);
      }
    }
  }
}
</script>

<style lang="less">
@import "index";
</style>
