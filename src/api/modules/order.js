import http from '../http'
import { EP } from '../endpoints'

/**
 * 购物车 / 结算 / 下单 / 订单
 */
export const orderApi = {
  /** 结算预览 */
  checkout: (payload) => http.post(EP.checkout, payload),
  /** 快速备注 */
  remarks: (cartId, sig) => http.get(EP.cartRemarks(cartId), { sig }),
  /** 结算可用地址 */
  cartAddresses: (cartId, sig) => http.get(EP.cartAddresses(cartId), { sig }),
  /** 重发订单验证码 */
  resendVerify: (cartId, sig) => http.post(EP.cartVerify(cartId), { sig, type: 'sms' }),
  /** 提交订单 */
  placeOrder: (userId, payload) => http.post(EP.placeOrder(userId), payload),
  /** 查询支付结果 */
  queryPay: (merchantOrderNo, userId) =>
    http.get(EP.payQuery, { merchantOrderNo, userId }),
  /** 订单列表 */
  list: (userId, offset) => http.get(EP.orderList(userId), { offset, limit: 10 }),
  /** 订单详情 */
  detail: (userId, orderId) => http.get(EP.orderDetail(userId, orderId))
}
