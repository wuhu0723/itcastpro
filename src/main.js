import Vue from 'vue'
import App from './App.vue'
import router from '@/router.js'

import store from '@/store.js'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.less'
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

Vue.use(ElementUI)

// 设置当前环境为部署(开发+上线)
Vue.config.productionTip = false

// 添加前置路由守卫--在路由跳转之前守卫当前跳转--判断跳转是否合理
router.beforeEach((to, from, next) => {
  // req.url
  // console.log(to)
  // 合理的请求必须有token
  var token = localStorage.getItem('itcastpro_token')
  if (token || to.path === '/login') {
    next()
  } else {
    console.log(1)
    next({ name: 'Login' })
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
