import Vue from 'vue'
import App from './App.vue'
import {initRouter} from './router'
import * as echarts from 'echarts'// 在import的后面，echarts的前面加一个 * as
import './theme/index.less'
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import mUpload from '@/components/mUpload'
import Print from 'vue-print-nb'
Vue.use(Print)
Vue.prototype.$echarts = echarts
// 注册全局组件  
import '@/mock'
import store from './store'
import 'animate.css/source/animate.css'
import Plugins from '@/plugins'
import {initI18n} from '@/utils/i18n'
import bootstrap from '@/bootstrap'
import 'moment/locale/zh-cn'
const router = initRouter(store.state.setting.asyncRoutes)
const i18n = initI18n('CN', 'US')
Vue.component('mUpload', mUpload);  
Vue.use(Antd)
Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(Plugins)

bootstrap({router, store, i18n, message: Vue.prototype.$message})
console.log(process.env.VUE_APP_API_BASE_URL);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
