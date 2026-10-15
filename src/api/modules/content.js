import http from '../http'
import { EP } from '../endpoints'

/**
 * 内容 / 权益（会员、红包、积分、余额、客服）
 */
export const contentApi = {
  /** 服务中心 */
  serviceCenter: () => http.get(EP.serviceCenter),
  /** 会员说明 */
  vipDescription: () => http.get(EP.vipDescription),
  /** 可用红包 */
  hongbaos: (userId) => http.get(EP.hongbaos(userId)),
  /** 过期红包 */
  expiredHongbaos: (userId) => http.get(EP.expiredHongbaos(userId)),
  /** 兑换红包 */
  exchangeHongbao: (userId, exchangeCode, captchaCode) =>
    http.post(EP.hongbaoExchange(userId), { exchange_code: exchangeCode, captcha_code: captchaCode }),
  /** 积分信息 */
  points: (userId) => http.get(EP.pointsInfo(userId)),
  /** 余额信息 */
  balance: (userId) => http.get(EP.balanceInfo(userId)),
  /** 绑定会员卡 */
  bindVip: (userId, number, password) =>
    http.post(EP.vipBind(userId), { number, password })
}
