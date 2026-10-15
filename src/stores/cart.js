/**
 * 购物车状态（跨店铺详情页与结算页共享，持久化到 localStorage）
 * cartMap: { [shopId]: { shopId, shopName, shopImage, shopLogoColor, minOrderAmount, deliveryFee, items: { [foodId]: FoodItem } } }
 */

const KEY = 'zhiwei_cart'

function loadPersisted() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

const state = {
  cartMap: loadPersisted()
}

function persist(s) {
  localStorage.setItem(KEY, JSON.stringify(s.cartMap))
}

const mutations = {
  ADD_FOOD(s, { shop, food }) {
    if (!s.cartMap[shop.id]) {
      s.cartMap[shop.id] = {
        shopId: shop.id,
        shopName: shop.name,
        shopImage: shop.image,
        shopLogoColor: shop.logoColor,
        minOrderAmount: shop.minOrderAmount,
        deliveryFee: shop.deliveryFee,
        items: {}
      }
    }
    const cart = s.cartMap[shop.id]
    const existing = cart.items[food.id]
    if (existing) {
      existing.quantity += 1
    } else {
      cart.items[food.id] = {
        id: food.id,
        name: food.name,
        price: food.price,
        image: food.image,
        quantity: 1,
        spec: food.chosenSpec || ''
      }
    }
    s.cartMap = { ...s.cartMap }
    persist(s)
  },
  DECREASE_FOOD(s, { shopId, foodId }) {
    const cart = s.cartMap[shopId]
    if (!cart) return
    const item = cart.items[foodId]
    if (!item) return
    item.quantity -= 1
    if (item.quantity <= 0) delete cart.items[foodId]
    if (Object.keys(cart.items).length === 0) delete s.cartMap[shopId]
    s.cartMap = { ...s.cartMap }
    persist(s)
  },
  CLEAR_CART(s, shopId) {
    delete s.cartMap[shopId]
    s.cartMap = { ...s.cartMap }
    persist(s)
  }
}

const actions = {
  addFood({ commit }, payload) {
    commit('ADD_FOOD', payload)
  },
  decreaseFood({ commit }, payload) {
    commit('DECREASE_FOOD', payload)
  },
  clearCart({ commit }, shopId) {
    commit('CLEAR_CART', shopId)
  }
}

const getters = {
  cartOf: (s) => (shopId) => s.cartMap[shopId] || null,
  foodCount: (s) => (shopId, foodId) => {
    const cart = s.cartMap[shopId]
    return cart && cart.items[foodId] ? cart.items[foodId].quantity : 0
  },
  totalCount: (s) => (shopId) => {
    const cart = s.cartMap[shopId]
    if (!cart) return 0
    return Object.values(cart.items).reduce((sum, it) => sum + it.quantity, 0)
  },
  totalPrice: (s) => (shopId) => {
    const cart = s.cartMap[shopId]
    if (!cart) return 0
    return +Object.values(cart.items)
      .reduce((sum, it) => sum + it.price * it.quantity, 0)
      .toFixed(2)
  },
  entitiesOf: (s) => (shopId) => {
    const cart = s.cartMap[shopId]
    if (!cart) return []
    return Object.values(cart.items).map((it) => ({
      foodId: it.id,
      name: it.name,
      price: it.price,
      quantity: it.quantity,
      spec: it.spec || ''
    }))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
