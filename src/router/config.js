import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
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
              name: '电气计划',
              meta: {
                permission: [],
                id: 77,
                parentID: 17,
              },
              component: BlankView,
              children: [
                {
                  path: 'done',
                  name: '已完成',
                  meta: {
                    permission: [],
                    icon: 'dashboard',
                    id: 84,
                    parentID: 77,
                  },
                  component: () => import('@/pages/electrical/done.vue'),
                },
                {
                  path: 'completed',
                  name: '待完成',
                  meta: {
                    permission: [],
                    icon: 'dashboard',
                    id: 85,
                    parentID: 77,
                  },
                  component: () => import('@/pages/electrical/plan.vue'),
                },
              ]
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
              name: '工单统计',
              meta: {
                permission: [],
                id: 39,
                parentID: 21,
              },
              component: () => import('@/pages/statistics/index.vue'),
            },
            {
              path: 'log',
              name: '日志统计',
              meta: {
                permission: [],
                id: 40,
                parentID: 21,
              },
              component: () => import('@/pages/statistics/index.vue'),
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

          ]
        },
        {
          name: '验权页面',
          path: 'auth/demo',
          meta: {
            permission: [],
            icon: 'file-ppt',
            authority: {
              permission: 'form',
              role: 'manager'
            },
            component: () => import('@/pages/demo')
          }
        }
      ]
    }
  ]
}

export default options
