<template>
  <div class="home">
    <h1>Home eee</h1>
    <p>{{ message }}</p>
    <input type="text" v-model="message">
    <p>
      <button @click="bundle">点击</button>
    </p>

    <ul>
      <li v-for="item in list" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getList } from '@/api/test'

export default {
  name: 'Home',
  async asyncData ({ store }) {
    // 获取数据
    const { data } = await getList()
    const list = data.data || []

    // 设置 store 数据
    store.commit('setList', list)
    return {
      list
    }
  },
  data () {
    return {
      message: '123'
    }
  },
  computed: {
    ...mapState(['list'])
  },
  methods: {
    // ...mapActions(['getList']),
    bundle () {
      console.log('click bundle')
    }
  },
  // // Vue SSR 特殊为服务端渲染提供的一个生命周期钩子函数
  // serverPrefetch () {
  //   return this.getList()
  // },
  metaInfo: {
    title: 'Home'
  }
}
</script>

<style>

</style>
