/**
 * 接口端点集中管理。
 * 路径为项目自拟，便于后端按同一契约实现；接真实后端时只需改这里与 .env。
 */

export const EP = {
  // 城市 / 定位
  cityGuess: '/cities/guess',
  cityHot: '/cities/hot',
  cityGroups: '/cities/groups',
  cityById: (id) => `/cities/${id}`,
  placeSearch: '/places/search',
  placeNearby: '/places/nearby',
  locationResolve: '/location/resolve',

  // 商家
  shopList: '/shops',
  shopCategories: '/shops/categories',
  shopDeliveryModes: '/shops/delivery-modes',
  shopActivityAttrs: '/shops/activity-attributes',
  shopSearch: '/shops/search',
  shopDetail: (id) => `/shops/${id}`,
  shopMenu: (id) => `/shops/${id}/menu`,
  shopRatings: (id) => `/shops/${id}/ratings`,
  shopRatingScores: (id) => `/shops/${id}/ratings/scores`,
  shopRatingTags: (id) => `/shops/${id}/ratings/tags`,

  // 食品详情
  foodDetail: (shopId, foodId) => `/shops/${shopId}/foods/${foodId}`,

  // 账号 / 鉴权
  captcha: '/auth/captcha',
  smsCode: '/auth/sms-code',
  accountExists: '/auth/exists',
  loginPassword: '/auth/login/password',
  loginMobile: '/auth/login/mobile',
  signout: '/auth/signout',
  userProfile: '/user',
  changePassword: '/user/password',

  // 购物车 / 结算 / 下单
  checkout: '/carts/checkout',
  cartRemarks: (id) => `/carts/${id}/remarks`,
  cartAddresses: (id) => `/carts/${id}/addresses`,
  cartVerify: (id) => `/carts/${id}/verify`,
  placeOrder: (userId) => `/users/${userId}/orders`,
  payQuery: '/payments/query',

  // 收货地址
  addresses: (userId) => `/users/${userId}/addresses`,
  addressById: (userId, addressId) => `/users/${userId}/addresses/${addressId}`,

  // 订单
  orderList: (userId) => `/users/${userId}/orders`,
  orderDetail: (userId, orderId) => `/users/${userId}/orders/${orderId}/snapshot`,

  // 内容 / 权益（外围）
  serviceCenter: '/content/service',
  vipDescription: '/content/vip/description',
  hongbaos: (userId) => `/users/${userId}/hongbaos`,
  expiredHongbaos: (userId) => `/users/${userId}/expired-hongbaos`,
  hongbaoExchange: (userId) => `/users/${userId}/hongbao/exchange`,
  pointsInfo: (userId) => `/users/${userId}/points`,
  balanceInfo: (userId) => `/users/${userId}/balance`,
  vipBind: (userId) => `/member/users/${userId}/vip-card/bind`
}
