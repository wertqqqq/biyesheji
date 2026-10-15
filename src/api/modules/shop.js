import http from '../http'
import { EP } from '../endpoints'

/**
 * 商家 / 菜单 / 评价
 */
export const shopApi = {
  /** 首页美食分类 */
  categories: () => http.get(EP.shopCategories),
  /** 配送方式筛选项 */
  deliveryModes: () => http.get(EP.shopDeliveryModes),
  /** 商家属性筛选项 */
  activityAttributes: () => http.get(EP.shopActivityAttrs),
  /**
   * 商家列表（分页 + 筛选 + 排序）
   * @param {{latitude:number, longitude:number, offset?:number, limit?:number,
   *   order_by?:string, category_id?:string, support_ids?:string[], keyword?:string}} params
   * @returns {Promise<import('../types').Paginated>}
   */
  list: (params) => http.get(EP.shopList, params),
  /** 搜索商家 */
  search: (geohash, keyword) => http.get(EP.shopSearch, { geohash, keyword }),
  /** 商家详情 */
  detail: (id, latitude, longitude) =>
    http.get(EP.shopDetail(id), { latitude, longitude }),
  /** 商家菜单 */
  menu: (id) => http.get(EP.shopMenu(id)),
  /** 评价列表 */
  ratings: (id, offset, tagName) =>
    http.get(EP.shopRatings(id), { offset, limit: 10, tag_name: tagName || '' }),
  /** 评价分数 */
  ratingScores: (id) => http.get(EP.shopRatingScores(id)),
  /** 评价标签 */
  ratingTags: (id) => http.get(EP.shopRatingTags(id)),
  /** 单个菜品详情 */
  foodDetail: (shopId, foodId) => http.get(EP.foodDetail(shopId, foodId))
}
