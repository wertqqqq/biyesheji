import Vue from 'vue'
import Vuex from 'vuex'
import location from './location'
import cart from './cart'
import user from './user'
import checkout from './checkout'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    location,
    cart,
    user,
    checkout
  },
  strict: import.meta.env.DEV
})
