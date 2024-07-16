import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/PageView'
import home from '@/pages/home'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
      children: [
        {
          path: 'home',
          name: '首页',
          meta: {
            permission: [],
            icon: 'dashboard',
            id: 14,
            parentID: 0
          },
          component: home,
        },
        {
          path: 'user',
          name: '组织架构',
          meta: {
            permission: [],
            icon: 'dashboard',
            parentID: 0,
            id: 15
          },
          component: BlankView,
          children: [
            {
              path: 'employee',
              name: '员工管理',
              meta: {
                permission: [],
                id: 24,
                parentID: 15,
              },
              component: () => import('@/pages/user/employee'),
            },
            {
              path: 'department',
              name: '部门管理',
              meta: {
                permission: [],
                id: 23,
                parentID: 15,
              },
              component: () => import('@/pages/user/department'),
            },
            {
              path: 'post',
              name: '职位管理',
              meta: {
                permission: [],
                id: 25,
                parentID: 15,
              },
              component: () => import('@/pages/user/post'),
            }
          ]
        },
        {
          path: 'project',
          name: '项目管理',
          meta: {
            permission: [],
            icon: 'dashboard',
            id: 16,
            parentID: 0,
          },
          component: () => import('@/pages/project/index'),
        },
        {
          path: 'electrical',
          name: '电气计划',
          meta: {
            permission: [],
            icon: 'dashboard',
            parentID: 0,
            id: 17
          },
          component: BlankView,
          children: [
            {
              path: 'plan',
              name: '电气项目',
              meta: {
                permission: [],
                id: 77,
                parentID: 17,
              },
              component: () => import('@/pages/electrical/plan.vue'),
            },
            {
              path: 'process',
              name: '电气流程',
              meta: {
                permission: [],
                id: 83,
                parentID: 17,
              },
              component: () => import('@/pages/electrical/process.vue'),
            },
            {
              path: 'log',
              name: '工作日志',
              meta: {
                permission: [],
                id: 78,
                parentID: 17,
              },
              component: () => import('@/pages/electrical/workLog.vue'),
            },
            {
              path: 'workContent',
              name: '工作内容',
              meta: {
                permission: [],
                id: 80,
                parentID: 17,
              },
              component: () => import('@/pages/electrical/workContent.vue'),
            },
            {
              path: 'material',
              name: '缺料报备',
              meta: {
                permission: [],
                id: 100,
                parentID: 17,
              },
              component: () => import('@/pages/electrical/material.vue'),
            }
          ]
        },
        {
          path: 'statistics',
          name: '统计报表',
          meta: {
            permission: [],
            icon: 'dashboard',
            id: 21,
            parentID: 0,
          },
          component: BlankView,
          children: [
            {
              path: 'plan',
              name: '项目统计',
              meta: {
                permission: [],
                id: 38,
                parentID: 21,
              },
              component: () => import('@/pages/statistics/index.vue'),
            },
            {
              path: 'order',
              name: '电气分析',
              meta: {
                permission: [],
                id: 39,
                parentID: 21,
              },
              component: () => import('@/pages/statistics/electric/index.vue'),
            },
            {
              path: 'log',
              name: '日志统计',
              meta: {
                permission: [],
                id: 40,
                parentID: 21,
              },
              component: () => import('@/pages/statistics/log/index.vue'),
            },
            {
              path: 'trip',
              name: '出差分布',
              meta: {
                permission: [],
                id: 86,
                parentID: 21,
              },
              component: () => import('@/pages/statistics/trip/index'),
            }
          ]
        },
        {
          path: 'backend',
          name: '后台管理',
          meta: {
            permission: [],
            icon: 'dashboard',
            id: 22,
            parentID: 0,
          },
          component: BlankView,
          children: [
            {
              path: 'systemLog',
              name: '系统日志',
              meta: {
                permission: [],
                id: 32,
                parentID: 22,
              },
              component: () => import('@/pages/backend/systemLog'),
            },
            {
              path: 'module',
              name: '模块管理',
              meta: {
                permission: [],
                id: 34,
                parentID: 22,
              },
              component: () => import('@/pages/backend/module'),
            },
            {
              path: 'authority',
              name: '权限管理',
              meta: {
                permission: [],
                id: 33,
                parentID: 22,
              },
              component: () => import('@/pages/backend/authority'),
            },
            {
              path: 'announcement',
              name: '公告管理',
              meta: {
                permission: [],
                id: 49,
                parentID: 22,
              },
              component: () => import('@/pages/backend/announcement'),
            },
            {
              path: 'userconfig',
              name: '用户配置',
              meta: {
                permission: [],
                id: 99,
                parentID: 22,
              },
              component: () => import('@/pages/backend/userConfig'),
            }
          ]
        },
        {
          path: 'notices',
          name: '公告列表',
          meta: {
            permission: [],
            icon: 'dashboard',
          },
          component: () => import('@/pages/notice/index.vue'),
        },
        {
          path: 'noticeDetail',
          name: '公告详情',
          meta: {
            permission: [],
            icon: 'dashboard',
          },
          component: () => import('@/pages/notice/detail.vue'),
        },
        {
          path: 'userCenter',
          name: '个人中心',
          meta: {
            permission: [],
            icon: 'dashboard',
          },
          component: () => import('@/pages/user/userCenter.vue'),
        },
        // {
        //   name: '测试',
        //   path: 'demo',
        //   component: PageView,
        //   meta: {
        //     icon: 'file-ppt',
        //     component: () => import('@/pages/electrical/workContent.vue'),
        //   }
        // }
      ]
    }
  ]
}

export default options
