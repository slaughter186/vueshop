import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './plugins/element.js'

Vue.config.productionTip = false

import '@/assets/css/base.css'

// 配置请求根路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
//把axios设置为this.$http,否则其他组件都调用不了
Vue.prototype.$http=axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

