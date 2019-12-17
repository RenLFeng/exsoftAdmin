import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import './plugins/element.js'
import './assets/css/normalize.css'
import './assets/css/public.css'
import './assets/css/style.css'
import '@/element-variables.scss'
import './assets/scss/global.scss'
import '@/assets/icon/iconfont.css'
import '@/assets/icon2/iconfont.css'
import axios from 'axios'
import {defaultImg} from "@/util"
Vue.prototype.$defaultImg = defaultImg
Vue.prototype.$http = axios
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
