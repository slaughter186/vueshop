import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
//局部导入element时用
// import './plugins/element.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

Vue.use(ElementUI);
import '@/assets/css/base.css'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

//增加axios拦截器，给headers头部增加Authorization属性，值为token
//最后一定有return config，固定写法
axios.interceptors.request.use((config) => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

Vue.prototype.$http = axios

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

