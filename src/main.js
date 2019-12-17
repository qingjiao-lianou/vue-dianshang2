import Vue from 'vue'
import App from './App.vue'
import '@/style/index.less'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from '../src/router/router.js'

Vue.use(ElementUI)

// 添加导航守卫
router.beforeEach((to, from, next) => {
  //  获取token
  let mytoken = localStorage.getItem('token')
  //  判断
  if (mytoken || to.path === '/login') {
    // 下一步
    next()
  } else {
    // 重定向
    next({ path: '/login' })
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
