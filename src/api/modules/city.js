import http from '../http'
import { EP } from '../endpoints'

/**
 * 城市 / 定位
 * @returns {Promise<import('../types').City>}
 */
export const cityApi = {
  /** 定位默认城市 */
  guessCity: () => http.get(EP.cityGuess),
  /** 热门城市 */
  hotCities: () => http.get(EP.cityHot),
  /** 按字母分组的城市 */
  cityGroups: () => http.get(EP.cityGroups),
  /** 搜索地址 */
  searchPlaces: (keyword, cityId) => http.get(EP.placeSearch, { keyword, city_id: cityId }),
  /** 附近地址 */
  nearbyPlaces: (keyword) => http.get(EP.placeNearby, { keyword }),
  /** 由 geohash 反解地址 */
  resolveLocation: (geohash) => http.get(EP.locationResolve, { geohash })
}
