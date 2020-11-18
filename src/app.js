import Vue from 'vue'
import App from './App.vue'
import Meta from 'vue-meta'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'

Vue.use(Meta)

Vue.mixin({
  metaInfo: {
    titleTemplate: '%s - Vue SSR'
  }
})

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp () {
  // 创建路由
  const router = createRouter()
  // 创建 Store
  const store = createStore()

  // 同步路由状态(route state)到 store
  sync(store, router)

  const app = new Vue({
    router,
    store,
    // 根实例简单的渲染应用程序组件。
    render: h => h(App)
  })
  return { app, router, store }
}
