import Vue from 'vue'
import App from './App.vue'
import router from '@/router.js'

// 设置当前环境为部署(开发+上线)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
