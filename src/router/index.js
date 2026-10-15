import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

/**
 * 全量路由表。扁平结构（App 提供外壳），各页面独立，便于单独调试。
 * keepAlive 仅用于商家列表，兼顾性能与内存。
 */
const routes = [
  { path: '/', redirect: '/home' },

  // 入口 / 定位
  { path: '/home', name: 'home', component: () => import('@views/HomeView.vue'), meta: { title: '知味' } },
  { path: '/city', name: 'city', component: () => import('@views/CityPickerView.vue'), meta: { title: '选择城市' } },

  // 核心交易链路
  {
    path: '/shops',
    name: 'shops',
    component: () => import('@views/ShopListView.vue'),
    meta: { title: '附近商家', keepAlive: true }
  },
  { path: '/search', name: 'search', component: () => import('@views/SearchView.vue'), meta: { title: '搜索' } },
  { path: '/food', name: 'food', component: () => import('@views/FoodView.vue'), meta: { title: '分类美食' } },
  { path: '/shops/:id', name: 'shopDetail', component: () => import('@views/ShopDetailView.vue'), meta: { title: '商家详情' } },
  { path: '/shops/:id/safe', name: 'shopSafe', component: () => import('@views/ShopSafeView.vue'), meta: { title: '资质与安全' } },
  {
    path: '/shops/:id/food/:foodId',
    name: 'foodDetail',
    component: () => import('@views/FoodDetailView.vue'),
    meta: { title: '菜品详情' }
  },

  // 账号
  { path: '/login', name: 'login', component: () => import('@views/LoginView.vue'), meta: { title: '登录' } },
  { path: '/forget', name: 'forget', component: () => import('@views/ForgetView.vue'), meta: { title: '修改密码' } },

  // 结算流程
  { path: '/checkout', name: 'checkout', component: () => import('@views/CheckoutView.vue'), meta: { title: '确认订单' } },
  { path: '/checkout/remark', name: 'remark', component: () => import('@views/checkout/RemarkView.vue'), meta: { title: '订单备注' } },
  { path: '/checkout/invoice', name: 'invoice', component: () => import('@views/checkout/InvoiceView.vue'), meta: { title: '发票抬头' } },
  { path: '/checkout/payment', name: 'payment', component: () => import('@views/checkout/PaymentView.vue'), meta: { title: '支付方式' } },
  { path: '/checkout/verify', name: 'verify', component: () => import('@views/checkout/VerifyView.vue'), meta: { title: '身份验证' } },
  { path: '/checkout/address', name: 'chooseAddress', component: () => import('@views/checkout/ChooseAddressView.vue'), meta: { title: '选择地址' } },
  { path: '/checkout/address/new', name: 'checkoutAddAddress', component: () => import('@views/checkout/AddAddressView.vue'), meta: { title: '新增地址' } },
  {
    path: '/checkout/address/new/search',
    name: 'searchAddress',
    component: () => import('@views/checkout/SearchAddressView.vue'),
    meta: { title: '搜索地址' }
  },

  // 订单
  { path: '/orders', name: 'orders', component: () => import('@views/OrderListView.vue'), meta: { title: '我的订单' } },
  { path: '/orders/:id', name: 'orderDetail', component: () => import('@views/OrderDetailView.vue'), meta: { title: '订单详情' } },

  // 我的 / 个人中心
  { path: '/account', name: 'account', component: () => import('@views/AccountView.vue'), meta: { title: '我的' } },
  { path: '/account/info', name: 'accountInfo', component: () => import('@views/account/InfoView.vue'), meta: { title: '个人资料' } },
  { path: '/account/info/username', name: 'setUsername', component: () => import('@views/account/SetUsernameView.vue'), meta: { title: '修改用户名' } },
  { path: '/account/addresses', name: 'addresses', component: () => import('@views/account/AddressListView.vue'), meta: { title: '收货地址' } },
  { path: '/account/addresses/new', name: 'addressNew', component: () => import('@views/account/AddressEditView.vue'), meta: { title: '新增地址' } },
  { path: '/account/addresses/:id', name: 'addressEdit', component: () => import('@views/account/AddressEditView.vue'), meta: { title: '编辑地址' } },

  // 服务
  { path: '/service', name: 'service', component: () => import('@views/ServiceView.vue'), meta: { title: '服务中心' } },
  { path: '/account/service', component: () => import('@views/ServiceView.vue'), meta: { title: '服务中心' } },
  { path: '/service/question/:id', name: 'questionDetail', component: () => import('@views/QuestionDetailView.vue'), meta: { title: '问题详情' } },

  // 会员卡
  { path: '/vipcard', name: 'vipcard', component: () => import('@views/VipcardView.vue'), meta: { title: '会员卡' } },
  { path: '/vipcard/description', name: 'vipDescription', component: () => import('@views/vip/VipDescriptionView.vue'), meta: { title: '会员说明' } },
  { path: '/vipcard/buy', name: 'vipBuy', component: () => import('@views/vip/VipBuyView.vue'), meta: { title: '购买会员卡' } },
  { path: '/vipcard/records', name: 'vipRecords', component: () => import('@views/vip/VipRecordsView.vue'), meta: { title: '开票记录' } },

  // 优惠 / 红包 / 积分 / 余额
  { path: '/benefit', name: 'benefit', component: () => import('@views/BenefitView.vue'), meta: { title: '我的优惠' } },
  { path: '/benefit/coupon', name: 'coupon', component: () => import('@views/benefit/CouponView.vue'), meta: { title: '代金券说明' } },
  { path: '/benefit/hb-description', name: 'hbDescription', component: () => import('@views/benefit/HbDescriptionView.vue'), meta: { title: '红包说明' } },
  { path: '/benefit/history', name: 'hbHistory', component: () => import('@views/benefit/HbHistoryView.vue'), meta: { title: '历史红包' } },
  { path: '/benefit/exchange', name: 'exchange', component: () => import('@views/benefit/ExchangeView.vue'), meta: { title: '兑换红包' } },
  { path: '/benefit/commend', name: 'commend', component: () => import('@views/benefit/CommendView.vue'), meta: { title: '推荐有奖' } },
  { path: '/points', name: 'points', component: () => import('@views/PointsView.vue'), meta: { title: '我的积分' } },
  { path: '/points/detail', name: 'pointsDetail', component: () => import('@views/PointsDetailView.vue'), meta: { title: '积分说明' } },
  { path: '/balance', name: 'balance', component: () => import('@views/BalanceView.vue'), meta: { title: '我的余额' } },
  { path: '/balance/detail', name: 'balanceDetail', component: () => import('@views/BalanceDetailView.vue'), meta: { title: '余额说明' } },

  // 其他
  { path: '/download', name: 'download', component: () => import('@views/DownloadView.vue'), meta: { title: '下载 App' } },
  { path: '/find', name: 'find', component: () => import('@views/FindView.vue'), meta: { title: '发现' } },

  { path: '*', name: 'notFound', component: () => import('@views/NotFoundView.vue'), meta: { title: '页面不存在' } }
]

const router = new VueRouter({
  mode: 'hash',
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title
  if (title) document.title = `${title} · 知味`
  next()
})

export default router
