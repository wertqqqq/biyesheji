import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import store from './stores'
import { registerToast } from './components/base/ToastHost.vue'
import './styles/base.scss'

Vue.use(VueRouter)
Vue.use(Vuex)

Vue.config.productionTip = false

// 全局轻提示（命令式调用，无需在每个页面引入）
registerToast(Vue)

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
