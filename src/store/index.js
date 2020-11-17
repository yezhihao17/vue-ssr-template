import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: () => {
      return {
        list: []
      }
    },
    mutations: {
      setList (state, payload) {
        state.list = payload
      }
    },
    actions: {
      // 请求列表
      async getList ({ commit }) {
        const { data } = await axios.get('https://test.edianyao.com/micro/ydymkth5/qywtab/tabList')
        commit('setList', data.data)
      }
    }
  })
}
