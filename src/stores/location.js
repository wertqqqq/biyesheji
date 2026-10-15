/**
 * 定位 / 城市 / 收货地址 状态
 */
const KEY = 'zhiwei_location'

function loadPersisted() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

const persisted = loadPersisted()

const state = {
  geohash: persisted.geohash || '31.22299,121.36025',
  city: persisted.city || { id: 1, name: '上海' },
  address: persisted.address || null // 选中的收货地址
}

const mutations = {
  SET_GEOHASH(s, geohash) {
    s.geohash = geohash
    persist(s)
  },
  SET_CITY(s, city) {
    s.city = city
    persist(s)
  },
  SET_ADDRESS(s, address) {
    s.address = address
    persist(s)
  }
}

const actions = {
  setGeohash({ commit }, geohash) {
    commit('SET_GEOHASH', geohash)
  },
  selectCity({ commit }, city) {
    commit('SET_CITY', city)
    if (city && city.geohash) commit('SET_GEOHASH', city.geohash)
  },
  selectAddress({ commit }, address) {
    commit('SET_ADDRESS', address)
  }
}

const getters = {
  latitude: (s) => Number(s.geohash.split(',')[0]),
  longitude: (s) => Number(s.geohash.split(',')[1]),
  cityName: (s) => (s.city ? s.city.name : '')
}

function persist(s) {
  localStorage.setItem(
    KEY,
    JSON.stringify({ geohash: s.geohash, city: s.city, address: s.address })
  )
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
