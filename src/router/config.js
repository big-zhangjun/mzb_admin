import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
// import PageView from '@/layouts/PageView'

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
          path: 'user',
          name: '组织架构',
          meta: {
            icon: 'dashboard',
          },
          component: BlankView,
          children: [
            {
              path: 'employee',
              name: '员工管理',
              component: () => import('@/pages/user/employee'),
            },
            {
              path: 'department',
              name: '部门管理',
              component: () => import('@/pages/user/department'),
            },
            {
              path: 'post',
              name: '职位管理',
              component: () => import('@/pages/user/post'),
            }
          ]
        },
        {
          path: 'backend',
          name: '后台管理',
          meta: {
            icon: 'dashboard',
          },
          component: BlankView,
          children: [
            {
              path: 'systemLog',
              name: '系统日志',
              component: () => import('@/pages/backend/systemLog'),
            },
            {
              path: 'module',
              name: '模块管理',
              component: () => import('@/pages/backend/module'),
            },
            {
              path: 'authority',
              name: '权限管理',
              component: () => import('@/pages/backend/authority'),
            },
            
          ]
        },
        // {
        //   path: 'parent2',
        //   name: '父级路由2',
        //   meta: {
        //     icon: 'form'
        //   },
        //   component: PageView,
        //   children: [
        //     {
        //       path: 'demo2',
        //       name: '演示页面2',
        //       component: () => import('@/pages/demo'),
        //     }
        //   ]
        // },
        // {
        //   path: 'exception',
        //   name: '异常页',
        //   meta: {
        //     icon: 'warning',
        //   },
        //   component: BlankView,
        //   children: [
        //     {
        //       path: '404',
        //       name: 'Exp404',
        //       component: () => import('@/pages/exception/404')
        //     },
        //     {
        //       path: '403',
        //       name: 'Exp403',
        //       component: () => import('@/pages/exception/403')
        //     },
        //     {
        //       path: '500',
        //       name: 'Exp500',
        //       component: () => import('@/pages/exception/500')
        //     }
        //   ]
        // },
        {
          name: '验权页面',
          path: 'auth/demo',
          meta: {
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
