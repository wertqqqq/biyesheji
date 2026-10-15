/**
 * 领域模型类型定义（JSDoc @typedef）。
 * 在 JS 项目里提供类型提示与契约说明，供 api/modules、store 与组件引用。
 * 接真实后端时，以此文件作为字段对齐基准。
 */

/**
 * @typedef {Object} City
 * @property {number} id
 * @property {string} name
 * @property {string} [abbr]  拼音首字母（分组用）
 */

/**
 * @typedef {Object} Place
 * @property {string} name
 * @property {string} address
 * @property {string} geohash
 * @property {number} [latitude]
 * @property {number} [longitude]
 */

/**
 * @typedef {Object} Location
 * @property {string} geohash  形如 "31.22299,121.36025"
 * @property {string} name
 * @property {string} address
 */

/**
 * @typedef {Object} ShopActivity
 * @property {string} icon  活动图标标识
 * @property {string} tips  活动短描述
 * @property {string} [description]  活动详情
 */

/**
 * @typedef {Object} ShopSupport
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef {Object} ShopSummary
 * @property {string} id
 * @property {string} name
 * @property {string} image  食物/店铺图像（emoji 占位）
 * @property {string} logoColor  主题渐变起点色
 * @property {string} [bannerColor]
 * @property {string} category  分类，如「快餐便当」
 * @property {number} rating  评分
 * @property {number} ratingCount  评价数
 * @property {number} recentOrderNum  月售
 * @property {number} distance  距离（米）
 * @property {number} deliveryFee  配送费（元）
 * @property {number} minOrderAmount  起送价（元）
 * @property {number} leadTime  预计送达（分钟）
 * @property {{text:string,color:string}} deliveryMode  配送方式
 * @property {ShopSupport[]} supports  商家特性
 * @property {ShopActivity[]} activities  活动
 * @property {boolean} isBrand  是否品牌商家
 */

/**
 * @typedef {Object} ShopDetail extends ShopSummary
 * @property {string} announcement  公告
 * @property {string} [phone]
 * @property {string} address
 * @property {ShopSafe} safe
 * @property {Object} piecewiseAgentFee  配送费阶梯
 */

/**
 * @typedef {Object} ShopSafe
 * @property {boolean} certified  资质认证
 * @property {string} markdown  安全须知（markdown）
 */

/**
 * @typedef {Object} FoodSpec
 * @property {string} name
 * @property {string} [value]
 */

/**
 * @typedef {Object} Food
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {string} image  emoji
 * @property {number} monthSales  月售
 * @property {number} rating  好评率
 * @property {number} satisfyRate  满意度
 * @property {FoodSpec[]} [specs]
 */

/**
 * @typedef {Object} MenuCategory
 * @property {string} name
 * @property {string} icon
 * @property {Food[]} foods
 */

/**
 * @typedef {Object} RatingScores
 * @property {number} overall  综合
 * @property {number} service  服务
 * @property {number} food  口味
 * @property {number} [delivery]  配送
 */

/**
 * @typedef {Object} RatingTag
 * @property {string} name
 * @property {number} count
 * @property {boolean} unsatisfied  是否为差评标签
 */

/**
 * @typedef {Object} Rating
 * @property {string} id
 * @property {string} username
 * @property {string} avatar  emoji
 * @property {number} rating  星级 1-5
 * @property {string} text  评价内容
 * @property {string} timeAgo  相对时间
 * @property {string[]} orderItems  所点菜品
 * @property {string[]} [images]
 */

/**
 * @typedef {Object} Address
 * @property {string} id
 * @property {string} name  联系人
 * @property {string} phone
 * @property {string} [tag]  家/公司/学校
 * @property {string} address  地址
 * @property {string} detail  门牌号
 * @property {string} geohash
 * @property {number} [sex]
 */

/**
 * @typedef {Object} UserInfo
 * @property {string} id
 * @property {string} username
 * @property {string} [avatar]  emoji
 * @property {number} balance  余额（分）
 * @property {number} points  积分
 * @property {number} giftAmount  红包数
 */

/**
 * @typedef {Object} CartEntity
 * @property {string} foodId
 * @property {string} name
 * @property {number} price
 * @property {number} quantity
 * @property {string} [spec]
 */

/**
 * @typedef {Object} CheckoutResult
 * @property {string} cartId
 * @property {string} sig
 * @property {number} total  合计（元）
 * @property {number} packingFee  餐盒费（元）
 * @property {number} deliveryFee  配送费（元）
 * @property {number} minOrderAmount
 */

/**
 * @typedef {Object} OrderFood
 * @property {string} name
 * @property {number} quantity
 * @property {number} price
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} shopName
 * @property {string} shopImage
 * @property {string} shopLogoColor
 * @property {string} status  订单状态中文
 * @property {string} statusCode
 * @property {number} total
 * @property {string} timeAgo
 * @property {OrderFood[]} foods
 * @property {string} [address]
 */

/**
 * @typedef {Object} Hongbao
 * @property {string} id
 * @property {number} amount  金额（元）
 * @property {number} limitMap  使用门槛
 * @property {string} name
 * @property {string} expireAt
 */

/**
 * @typedef {Object} Paginated
 * @property {Array} list
 * @property {boolean} hasMore
 * @property {number} offset
 */
