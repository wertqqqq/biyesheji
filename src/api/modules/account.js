import http from '../http'
import { EP } from '../endpoints'

/**
 * 账号 / 鉴权 / 收货地址
 */
export const accountApi = {
  /** 图形验证码 */
  captcha: () => http.post(EP.captcha),
  /** 发送短信验证码 */
  smsCode: (mobile) => http.post(EP.smsCode, { mobile, scene: 'login' }),
  /** 账号是否已存在 */
  accountExists: (type, value) => http.get(EP.accountExists, { type, value }),
  /** 账号密码登录 */
  loginByPassword: (username, password, captchaCode) =>
    http.post(EP.loginPassword, { username, password, captcha_code: captchaCode }),
  /** 手机号 + 验证码登录 */
  loginByMobile: (mobile, code) => http.post(EP.loginMobile, { mobile, code }),
  /** 退出登录 */
  signout: () => http.post(EP.signout),
  /** 当前用户信息 */
  profile: () => http.get(EP.userProfile),
  /** 修改密码 */
  changePassword: (payload) => http.post(EP.changePassword, payload),
  /** 地址列表 */
  addresses: (userId) => http.get(EP.addresses(userId)),
  /** 新增地址 */
  addAddress: (userId, payload) => http.post(EP.addresses(userId), payload),
  /** 更新地址 */
  updateAddress: (userId, addressId, payload) =>
    http.put(EP.addressById(userId, addressId), payload),
  /** 删除地址 */
  deleteAddress: (userId, addressId) => http.del(EP.addressById(userId, addressId))
}
