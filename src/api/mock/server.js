import * as db from './fixtures'

/**
 * Mock 适配器：把统一的 request config 分发到假数据。
 * 返回统一响应体 { code, data, message }；code===0 为成功。
 * 切真实后端时，http.js 会改走 fetch，此文件不参与。
 */

// 会话内可变的运行时数据（新增地址/下单后会反映到列表）
const runtime = {
  addresses: db.mockAddresses.map((a) => ({ ...a })),
  orders: db.mockOrders.map((o) => ({ ...o })),
  user: { ...db.mockUser }
}

const ok = (data) => ({ code: 0, data, message: 'ok' })
const fail = (message, code = 1) => ({ code, data: null, message })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const rand4 = () => Math.floor(1000 + Math.random() * 9000).toString()

// 路径模式 -> 正则 + 参数名
function matchRoute(pattern, path) {
  const keys = []
  const regex = new RegExp(
    '^' +
      pattern.replace(/:[^/]+/g, (m) => {
        keys.push(m.slice(1))
        return '([^/]+)'
      }) +
      '$'
  )
  const m = path.match(regex)
  if (!m) return null
  const params = {}
  keys.forEach((k, i) => {
    params[k] = decodeURIComponent(m[i + 1])
  })
  return params
}

function toSummary(shop) {
  const { menu, announcement, safe, scores, tags, ...rest } = shop
  return rest
}

// 路由表
const routes = [
  // ---- 城市 / 定位 ----
  { method: 'GET', pattern: '/cities/guess', handler: () => ok(db.guessCity) },
  { method: 'GET', pattern: '/cities/hot', handler: () => ok(db.hotCities) },
  { method: 'GET', pattern: '/cities/groups', handler: () => ok(db.cityGroups) },
  {
    method: 'GET',
    pattern: '/cities/:id',
    handler: (c, p) => {
      const all = db.cityGroups.flatMap((g) => g.cities).concat(db.hotCities)
      const city = all.find((x) => String(x.id) === p.id)
      return city ? ok(city) : fail('城市不存在', 404)
    }
  },
  {
    method: 'GET',
    pattern: '/places/search',
    handler: (c) => {
      const kw = (c.params.keyword || '').trim()
      const list = kw
        ? db.nearbyPlaces.filter((p) => p.name.includes(kw) || p.address.includes(kw))
        : db.nearbyPlaces
      return ok(list)
    }
  },
  {
    method: 'GET',
    pattern: '/places/nearby',
    handler: (c) => {
      const kw = (c.params.keyword || '').trim()
      const list = kw
        ? db.nearbyPlaces.filter((p) => p.name.includes(kw) || p.address.includes(kw))
        : db.nearbyPlaces
      return ok(list)
    }
  },
  {
    method: 'GET',
    pattern: '/location/resolve',
    handler: (c) => {
      const gh = c.params.geohash
      const place = db.nearbyPlaces.find((p) => p.geohash === gh)
      return ok(place || db.defaultLocation)
    }
  },

  // ---- 筛选选项 ----
  { method: 'GET', pattern: '/shops/categories', handler: () => ok(db.foodCategories) },
  { method: 'GET', pattern: '/shops/delivery-modes', handler: () => ok(db.deliveryModes) },
  { method: 'GET', pattern: '/shops/activity-attributes', handler: () => ok(db.activityAttributes) },

  // ---- 商家列表 ----
  {
    method: 'GET',
    pattern: '/shops/search',
    handler: (c) => {
      const kw = (c.params.keyword || '').trim()
      const list = kw ? db.shops.filter((s) => s.name.includes(kw)) : db.shops
      return ok(list.map(toSummary))
    }
  },
  {
    method: 'GET',
    pattern: '/shops',
    handler: (c) => {
      const p = c.params || {}
      let list = db.shops.slice()
      const kw = (p.keyword || '').trim()
      if (kw) list = list.filter((s) => s.name.includes(kw) || s.category.includes(kw))
      const supportIds = p['support_ids[]'] || p.support_ids || []
      if (supportIds.includes('1')) list = list.filter((s) => s.isBrand)
      if (p.category_id) list = list.filter((s) => s.category.includes(String(p.category_id)))
      if (p.delivery_mode) list = list.filter((s) => s.leadTime <= 30)

      const order = p.order_by
      if (order === 'rating') list.sort((a, b) => b.rating - a.rating)
      else if (order === 'sales') list.sort((a, b) => b.recentOrderNum - a.recentOrderNum)
      else if (order === 'distance') list.sort((a, b) => a.distance - b.distance)

      const offset = Number(p.offset || 0)
      const limit = Number(p.limit || 20)
      const page = list.slice(offset, offset + limit)
      return ok({
        list: page.map(toSummary),
        hasMore: offset + limit < list.length,
        offset,
        total: list.length
      })
    }
  },

  // ---- 商家详情 / 菜单 / 评价 ----
  {
    method: 'GET',
    pattern: '/shops/:id',
    handler: (c, p) => {
      const shop = db.shops.find((s) => s.id === p.id)
      return shop ? ok(shop) : fail('商家不存在', 404)
    }
  },
  {
    method: 'GET',
    pattern: '/shops/:id/menu',
    handler: (c, p) => {
      const shop = db.shops.find((s) => s.id === p.id)
      return shop ? ok(shop.menu) : fail('商家不存在', 404)
    }
  },
  {
    method: 'GET',
    pattern: '/shops/:id/ratings/scores',
    handler: (c, p) => {
      const shop = db.shops.find((s) => s.id === p.id)
      return shop ? ok(shop.scores) : fail('商家不存在', 404)
    }
  },
  {
    method: 'GET',
    pattern: '/shops/:id/ratings/tags',
    handler: (c, p) => {
      const shop = db.shops.find((s) => s.id === p.id)
      return shop ? ok(shop.tags) : fail('商家不存在', 404)
    }
  },
  {
    method: 'GET',
    pattern: '/shops/:id/ratings',
    handler: (c, p) => {
      const shop = db.shops.find((s) => s.id === p.id)
      if (!shop) return fail('商家不存在', 404)
      const limit = Number(c.params.limit || 10)
      const offset = Number(c.params.offset || 0)
      const tag = c.params.tag_name || ''
      const list = db.generateRatings(shop, limit, offset, tag)
      return ok({ list, hasMore: offset + limit < shop.ratingCount, offset })
    }
  },
  {
    method: 'GET',
    pattern: '/shops/:shopId/foods/:foodId',
    handler: (c, p) => {
      const shop = db.shops.find((s) => s.id === p.shopId)
      if (!shop) return fail('商家不存在', 404)
      const food = shop.menu.flatMap((cat) => cat.foods).find((f) => f.id === p.foodId)
      if (!food) return fail('菜品不存在', 404)
      const cat = shop.menu.find((c2) => c2.foods.some((f) => f.id === p.foodId))
      return ok({ ...food, categoryName: cat ? cat.name : '', shopName: shop.name })
    }
  },

  // ---- 账号 / 鉴权 ----
  {
    method: 'POST',
    pattern: '/auth/captcha',
    handler: () => ok({ token: `cap-${Date.now()}`, code: rand4() })
  },
  {
    method: 'POST',
    pattern: '/auth/sms-code',
    handler: () => ok({ sent: true, mockCode: '1234' })
  },
  {
    method: 'GET',
    pattern: '/auth/exists',
    handler: (c) => ok({ exists: (c.params.value || '') === 'demo' })
  },
  {
    method: 'POST',
    pattern: '/auth/login/password',
    handler: (c) => {
      const { username, password } = c.data || {}
      if (!username || !password) return fail('请输入账号和密码')
      if (password.length < 6) return fail('密码长度至少 6 位')
      return ok({ token: 'mock-token-pwd', userInfo: { ...runtime.user, username } })
    }
  },
  {
    method: 'POST',
    pattern: '/auth/login/mobile',
    handler: (c) => {
      const { code, mobile } = c.data || {}
      if (!/^1\d{10}$/.test(mobile || '')) return fail('手机号格式不正确')
      if (String(code) !== '1234') return fail('验证码错误，请重新输入')
      return ok({ token: 'mock-token-sms', userInfo: { ...runtime.user, username: mobile } })
    }
  },
  { method: 'POST', pattern: '/auth/signout', handler: () => ok({ ok: true }) },
  { method: 'GET', pattern: '/user', handler: () => ok(runtime.user) },
  {
    method: 'POST',
    pattern: '/user/password',
    handler: (c) => {
      const { oldPassword, newPassword } = c.data || {}
      if (!oldPassword || !newPassword) return fail('请填写完整')
      if (newPassword.length < 6) return fail('新密码长度至少 6 位')
      return ok({ ok: true })
    }
  },

  // ---- 购物车 / 结算 / 下单 ----
  {
    method: 'POST',
    pattern: '/carts/checkout',
    handler: (c) => {
      const { entities = [], restaurant_id: shopId } = c.data || {}
      const shop = db.shops.find((s) => s.id === shopId)
      if (!shop) return fail('商家不存在', 404)
      if (!entities.length) return fail('购物车是空的')
      let goods = 0
      entities.forEach((e) => {
        goods += e.price * e.quantity
      })
      const packingFee = +(entities.length * 1.5).toFixed(2)
      const deliveryFee = shop.deliveryFee
      const total = +(goods + packingFee + deliveryFee).toFixed(2)
      if (goods < shop.minOrderAmount) {
        return fail(`还差 ¥${(shop.minOrderAmount - goods).toFixed(2)} 起送`)
      }
      return ok({
        cartId: `cart-${Date.now()}`,
        sig: 'mock-sig',
        total,
        goodsTotal: +goods.toFixed(2),
        packingFee,
        deliveryFee,
        minOrderAmount: shop.minOrderAmount
      })
    }
  },
  {
    method: 'GET',
    pattern: '/carts/:id/remarks',
    handler: () => ok(db.quickRemarks)
  },
  {
    method: 'GET',
    pattern: '/carts/:id/addresses',
    handler: () => ok(runtime.addresses)
  },
  {
    method: 'POST',
    pattern: '/carts/:id/verify',
    handler: () => ok({ sent: true, mockCode: '1234' })
  },
  {
    method: 'POST',
    pattern: '/users/:userId/orders',
    handler: (c) => {
      const { entities = [], address_id: addressId, description } = c.data || {}
      const validation = c.data || {}
      // 简单校验：演示验证码失败路径
      if (validation.validation_code && String(validation.validation_code) !== '1234') {
        return fail('验证码错误')
      }
      if (!addressId) return fail('请选择收货地址')
      if (!entities.length) return fail('购物车是空的')
      const addr = runtime.addresses.find((a) => a.id === addressId) || runtime.addresses[0]
      const shop = db.shops.find((s) => s.id === c.data.restaurant_id) || db.shops[0]
      const goodsTotal = entities.reduce((sum, e) => sum + e.price * e.quantity, 0)
      const order = {
        id: `o${9000 + runtime.orders.length + 1}`,
        shopName: shop.name,
        shopImage: shop.image,
        shopLogoColor: shop.logoColor,
        status: '已下单',
        statusCode: 'PLACED',
        total: +(goodsTotal + shop.deliveryFee + entities.length * 1.5).toFixed(2),
        timeAgo: '刚刚',
        address: addr ? `${addr.address} ${addr.detail}` : '',
        remark: description || '',
        foods: entities.map((e) => ({ name: e.name, quantity: e.quantity, price: e.price }))
      }
      runtime.orders.unshift(order)
      return ok(order)
    }
  },
  { method: 'POST', pattern: '/payments/query', handler: () => ok({ status: 'SUCCESS' }) },

  // ---- 收货地址 ----
  {
    method: 'GET',
    pattern: '/users/:userId/addresses',
    handler: () => ok(runtime.addresses)
  },
  {
    method: 'POST',
    pattern: '/users/:userId/addresses',
    handler: (c) => {
      const d = c.data || {}
      if (!d.name) return fail('请填写联系人')
      if (!/^1\d{10}$/.test(d.phone || '')) return fail('手机号格式不正确')
      if (!d.address) return fail('请填写地址')
      const addr = { id: `a${Date.now()}`, sex: 1, tag: '', ...d }
      runtime.addresses.push(addr)
      return ok(addr)
    }
  },
  {
    method: 'PUT',
    pattern: '/users/:userId/addresses/:addressId',
    handler: (c, p) => {
      const idx = runtime.addresses.findIndex((a) => a.id === p.addressId)
      if (idx === -1) return fail('地址不存在', 404)
      runtime.addresses[idx] = { ...runtime.addresses[idx], ...c.data }
      return ok(runtime.addresses[idx])
    }
  },
  {
    method: 'DELETE',
    pattern: '/users/:userId/addresses/:addressId',
    handler: (c, p) => {
      const idx = runtime.addresses.findIndex((a) => a.id === p.addressId)
      if (idx === -1) return fail('地址不存在', 404)
      runtime.addresses.splice(idx, 1)
      return ok({ ok: true })
    }
  },

  // ---- 订单 ----
  {
    method: 'GET',
    pattern: '/users/:userId/orders',
    handler: (c) => {
      const offset = Number(c.params.offset || 0)
      const limit = Number(c.params.limit || 10)
      const list = runtime.orders.slice(offset, offset + limit)
      return ok({ list, hasMore: offset + limit < runtime.orders.length, offset })
    }
  },
  {
    method: 'GET',
    pattern: '/users/:userId/orders/:orderId/snapshot',
    handler: (c, p) => {
      const order = runtime.orders.find((o) => o.id === p.orderId)
      return order ? ok(order) : fail('订单不存在', 404)
    }
  },

  // ---- 内容 / 权益 ----
  { method: 'GET', pattern: '/content/service', handler: () => ok(db.serviceCenter) },
  { method: 'GET', pattern: '/content/vip/description', handler: () => ok(db.vipDescription) },
  { method: 'GET', pattern: '/users/:userId/hongbaos', handler: () => ok(db.mockHongbaos) },
  {
    method: 'GET',
    pattern: '/users/:userId/expired_hongbaos',
    handler: () => ok(db.mockExpiredHongbaos)
  },
  {
    method: 'POST',
    pattern: '/users/:userId/hongbao/exchange',
    handler: (c) => {
      if (!c.data || !c.data.exchange_code) return fail('请输入兑换码')
      return ok({ ok: true, message: '兑换成功' })
    }
  },
  { method: 'GET', pattern: '/users/:userId/points', handler: () => ok(db.mockPoints) },
  { method: 'GET', pattern: '/users/:userId/balance', handler: () => ok(db.mockBalance) },
  {
    method: 'POST',
    pattern: '/member/users/:userId/vip-card/bind',
    handler: (c) => {
      if (!c.data || !c.data.number || !c.data.password) return fail('请填写卡号和密码')
      return ok({ ok: true, message: '会员卡绑定成功' })
    }
  }
]

export async function mockDispatch(config) {
  await sleep(180 + Math.random() * 320)
  const path = config.url.split('?')[0]
  for (const route of routes) {
    if (route.method !== config.method) continue
    const pathParams = matchRoute(route.pattern, path)
    if (pathParams) {
      try {
        return await route.handler(config, pathParams)
      } catch (err) {
        return fail(err.message || '服务异常', 500)
      }
    }
  }
  return fail(`接口不存在：${config.method} ${path}`, 404)
}
