/**
 * 结算流程的临时选择状态（备注 / 发票 / 支付方式 / 地址 / cartId·sig）。
 * 供结算页与其子页（备注、发票、支付、选地址）跨导航共享。
 */

const state = {
  remark: '',
  invoice: false,
  invoiceTitle: '个人',
  paymentMethod: 'wechat', // wechat | alipay
  addressId: null,
  needValidation: false,
  cartId: null,
  sig: null,
  pickedPlace: null // 从地址搜索页选中的 POI
}

const mutations = {
  SET_REMARK(s, v) {
    s.remark = v || ''
  },
  SET_INVOICE(s, { invoice, title }) {
    s.invoice = invoice
    if (title) s.invoiceTitle = title
  },
  SET_PAYMENT(s, method) {
    s.paymentMethod = method
  },
  SET_ADDRESS_ID(s, id) {
    s.addressId = id
  },
  SET_NEED_VALIDATION(s, v) {
    s.needValidation = v
  },
  SET_CART(s, { cartId, sig }) {
    s.cartId = cartId
    s.sig = sig
  },
  SET_PICKED_PLACE(s, place) {
    s.pickedPlace = place || null
  },
  RESET_CHECKOUT(s) {
    s.remark = ''
    s.invoice = false
    s.invoiceTitle = '个人'
    s.paymentMethod = 'wechat'
    s.addressId = null
    s.needValidation = false
    s.cartId = null
    s.sig = null
    s.pickedPlace = null
  }
}

const actions = {
  setRemark({ commit }, v) {
    commit('SET_REMARK', v)
  },
  setInvoice({ commit }, payload) {
    commit('SET_INVOICE', payload)
  },
  setPayment({ commit }, method) {
    commit('SET_PAYMENT', method)
  },
  selectAddress({ commit }, id) {
    commit('SET_ADDRESS_ID', id)
  },
  setCart({ commit }, payload) {
    commit('SET_CART', payload)
  },
  setPickedPlace({ commit }, place) {
    commit('SET_PICKED_PLACE', place)
  },
  reset({ commit }) {
    commit('RESET_CHECKOUT')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
