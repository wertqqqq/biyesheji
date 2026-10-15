/**
 * 用户 / 登录态
 */
import { accountApi } from '../api/modules/account'

const TOKEN_KEY = 'zhiwei_token'
const USER_KEY = 'zhiwei_user'

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || null
  } catch {
    return null
  }
}

const state = {
  token: localStorage.getItem(TOKEN_KEY) || '',
  userInfo: loadUser()
}

const mutations = {
  SET_TOKEN(s, token) {
    s.token = token
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  },
  SET_USER(s, user) {
    s.userInfo = user
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  }
}

const actions = {
  /** 账号密码登录 */
  async loginWithPassword({ commit }, { username, password, captchaCode }) {
    const data = await accountApi.loginByPassword(username, password, captchaCode)
    commit('SET_TOKEN', data.token)
    commit('SET_USER', data.userInfo)
    return data
  },
  /** 手机号 + 验证码登录 */
  async loginWithMobile({ commit }, { mobile, code }) {
    const data = await accountApi.loginByMobile(mobile, code)
    commit('SET_TOKEN', data.token)
    commit('SET_USER', data.userInfo)
    return data
  },
  /** 拉取最新用户信息 */
  async fetchProfile({ commit }) {
    const data = await accountApi.profile()
    commit('SET_USER', data)
    return data
  },
  /** 退出登录 */
  async logout({ commit }) {
    try {
      await accountApi.signout()
    } catch {
      /* 忽略退出接口异常 */
    }
    commit('SET_TOKEN', '')
    commit('SET_USER', null)
  }
}

const getters = {
  isLoggedIn: (s) => !!s.token,
  userId: (s) => (s.userInfo ? s.userInfo.id : ''),
  avatar: (s) => (s.userInfo && s.userInfo.avatar) || 'wode',
  displayName: (s) => (s.userInfo && s.userInfo.username) || '未登录'
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
