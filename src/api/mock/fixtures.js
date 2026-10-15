/**
 * Mock 种子数据。
 * 视觉采用 emoji + 渐变色占位，无需外部图片即可完整体验。
 * 数据为项目自拟，与任何参考项目无关。
 */

// ---------- 视觉工具 ----------
export const GRADIENTS = [
  ['#ff9a63', '#ff5a3c'],
  ['#5ac8fa', '#3b82f6'],
  ['#ffd66b', '#ffb027'],
  ['#7ee8a2', '#22c55e'],
  ['#c084fc', '#8b5cf6'],
  ['#fda4af', '#f43f5e'],
  ['#67e8f9', '#06b6d4'],
  ['#fdba74', '#f97316']
]

// ---------- 城市 / 定位 ----------
export const guessCity = { id: 1, name: '上海', abbr: 'S' }

export const hotCities = [
  { id: 1, name: '上海', abbr: 'S' },
  { id: 2, name: '北京', abbr: 'B' },
  { id: 3, name: '广州', abbr: 'G' },
  { id: 4, name: '深圳', abbr: 'S' },
  { id: 5, name: '杭州', abbr: 'H' },
  { id: 6, name: '成都', abbr: 'C' }
]

export const cityGroups = [
  {
    letter: 'A',
    cities: [{ id: 20, name: '安庆', abbr: 'A' }, { id: 21, name: '鞍山', abbr: 'A' }]
  },
  {
    letter: 'B',
    cities: [
      { id: 2, name: '北京', abbr: 'B' },
      { id: 22, name: '保定', abbr: 'B' },
      { id: 23, name: '蚌埠', abbr: 'B' }
    ]
  },
  {
    letter: 'C',
    cities: [
      { id: 6, name: '成都', abbr: 'C' },
      { id: 24, name: '重庆', abbr: 'C' },
      { id: 25, name: '长沙', abbr: 'C' }
    ]
  },
  {
    letter: 'G',
    cities: [
      { id: 3, name: '广州', abbr: 'G' },
      { id: 26, name: '桂林', abbr: 'G' }
    ]
  },
  {
    letter: 'H',
    cities: [
      { id: 5, name: '杭州', abbr: 'H' },
      { id: 27, name: '合肥', abbr: 'H' },
      { id: 28, name: '哈尔滨', abbr: 'H' }
    ]
  },
  {
    letter: 'S',
    cities: [
      { id: 1, name: '上海', abbr: 'S' },
      { id: 4, name: '深圳', abbr: 'S' },
      { id: 29, name: '苏州', abbr: 'S' }
    ]
  }
]

export const defaultLocation = {
  geohash: '31.22299,121.36025',
  name: '徐家汇 · 汇金百货',
  address: '上海市徐汇区肇嘉浜路 1000 号'
}

export const nearbyPlaces = [
  { name: '徐家汇 · 汇金百货', address: '肇嘉浜路 1000 号', geohash: '31.22299,121.36025' },
  { name: '人民广场 · 来福士', address: '西藏中路 268 号', geohash: '31.23221,121.46921' },
  { name: '陆家嘴 · 国金中心', address: '陆家嘴环路 1233 号', geohash: '31.23969,121.49979' },
  { name: '五角场 · 万达广场', address: '淞沪路 77 号', geohash: '31.30123,121.51476' },
  { name: '中山公园 · 龙之梦', address: '长宁路 1018 号', geohash: '31.22013,121.41963' }
]

// ---------- 首页 / 列表筛选 ----------
export const foodCategories = [
  { id: 1, name: '美食', icon: '🍜' },
  { id: 2, name: '快餐便当', icon: '🍱' },
  { id: 3, name: '奶茶饮品', icon: '🧋' },
  { id: 4, name: '甜品蛋糕', icon: '🍰' },
  { id: 5, name: '川湘菜', icon: '🌶️' },
  { id: 6, name: '早餐', icon: '🥟' },
  { id: 7, name: '水果生鲜', icon: '🍉' },
  { id: 8, name: '超市便利', icon: '🏪' }
]

export const deliveryModes = [
  { id: 1, name: '蜂鸟快送' },
  { id: 2, name: '准时达' },
  { id: 3, name: '到店自取' }
]

export const activityAttributes = [
  { id: 1, name: '品牌商家' },
  { id: 2, name: '新店开业' },
  { id: 3, name: '在线支付' },
  { id: 4, name: '开发票' },
  { id: 5, name: '满减优惠' },
  { id: 6, name: '会员红包' }
]

// ---------- 工厂 ----------
let foodSeq = 0
function makeFood(shopId, name, description, price, emoji, categoryIndex) {
  foodSeq += 1
  const r = (n) => ((foodSeq * 37 + n * 13) % 9) / 10
  return {
    id: `${shopId}-f${foodSeq}`,
    name,
    description,
    price,
    image: emoji,
    monthSales: 60 + Math.round(r(1) * 900),
    rating: 88 + Math.round(r(2) * 11),
    satisfyRate: 90 + Math.round(r(3) * 9),
    specs: [
      { name: '份量', value: categoryIndex % 2 === 0 ? '标准' : '大份' }
    ]
  }
}

function buildMenu(shopId, rawMenu) {
  return rawMenu.map((cat, ci) => ({
    name: cat[0],
    icon: cat[1],
    foods: cat[2].map((f) => makeFood(shopId, f[0], f[1], f[2], f[3], ci))
  }))
}

const SUPPORT_LIB = [
  { id: 1, name: '保' },
  { id: 2, name: '准' },
  { id: 3, name: '发票' },
  { id: 4, name: '票' }
]

// ---------- 店铺数据 ----------
const shopConfigs = [
  {
    id: '1',
    name: '川香居 · 麻辣香锅',
    image: '🌶️',
    category: '快餐便当',
    rating: 4.7,
    ratingCount: 2387,
    sales: 1560,
    distance: 1200,
    fee: 3,
    min: 20,
    lead: 30,
    brand: true,
    announcement: '本店食材当日采购，用心做好每一份香锅。高峰时段配送或有延迟，敬请谅解。',
    address: '徐汇区肇嘉浜路 1000 号 B1-12',
    activities: [
      { icon: '减', tips: '满 30 减 8，满 60 减 20' },
      { icon: '首', tips: '新用户立减 5 元' },
      { icon: '赠', tips: '满 50 赠送解暑酸梅汤一袋' }
    ],
    menu: [
      [
        '热销榜',
        '🔥',
        [
          ['招牌麻辣香锅', '荤素自选 · 麻辣鲜香', 38, '🍲'],
          ['藤椒嫩牛香锅', '现切牛肉 · 藤椒爆香', 46, '🥩'],
          ['番茄鲜虾香锅', '酸甜番茄 · 鲜活大虾', 48, '🍤']
        ]
      ],
      [
        '单品加料',
        '➕',
        [
          ['精品肥牛', '雪花纹理 · 入口即化', 22, '🥩'],
          ['手打虾滑', 'Q 弹爽滑', 18, '🍤'],
          ['鲜嫩鸭血', '去腥入味', 8, '🍽️'],
          ['有机时蔬拼盘', '当日现摘', 12, '🥬']
        ]
      ],
      [
        '主食饮品',
        '🍚',
        [
          ['五常米饭', '东北珍珠米', 3, '🍚'],
          ['手工拉面', '现拉现煮', 6, '🍜'],
          ['冰镇酸梅汤', '古法熬制', 8, '🧊']
        ]
      ]
    ]
  },
  {
    id: '2',
    name: '麦香烘焙坊',
    image: '🥐',
    category: '甜品蛋糕',
    rating: 4.9,
    ratingCount: 1862,
    sales: 980,
    distance: 650,
    fee: 0,
    min: 15,
    lead: 25,
    brand: true,
    announcement: '每日现烤，18:00 后面包 8 折，欢迎到店选购。',
    address: '徐汇区南丹东路 300 号',
    activities: [
      { icon: '减', tips: '满 25 减 5' },
      { icon: '新', tips: '新店开业全场 9 折' }
    ],
    menu: [
      [
        '现烤面包',
        '🍞',
        [
          ['海盐芝士可颂', '外酥内软 · 咸香芝士', 16, '🥐'],
          ['全麦吐司', '低糖低油 · 高纤', 12, '🍞'],
          ['肉桂卷', '冬日限定暖心', 14, '🌀'],
          ['肉松小贝', '层层肉松 · 咸甜可口', 10, '🧁']
        ]
      ],
      [
        '甜品蛋糕',
        '🍰',
        [
          ['草莓奶油蛋糕', '当季草莓 · 动物奶油', 68, '🍰'],
          ['提拉米苏', '意式经典 · 微醺酒香', 42, '🍫'],
          ['抹茶千层', '宇治抹茶 · 20 层', 45, '🍵']
        ]
      ],
      [
        '饮品',
        '☕',
        [
          ['美式咖啡', '当日现磨', 15, '☕'],
          ['燕麦拿铁', '燕麦奶 · 醇厚顺滑', 22, '🥛']
        ]
      ]
    ]
  },
  {
    id: '3',
    name: '和风寿司屋',
    image: '🍣',
    category: '日料寿司',
    rating: 4.6,
    ratingCount: 1245,
    sales: 720,
    distance: 1800,
    fee: 5,
    min: 30,
    lead: 35,
    brand: false,
    announcement: '刺身均选用当日到店冰鲜食材，请放心食用。',
    address: '徐汇区漕溪北路 88 号',
    activities: [{ icon: '减', tips: '满 60 减 15' }],
    menu: [
      [
        '招牌寿司',
        '🍣',
        [
          ['三文鱼刺身', '挪威进口 · 厚切', 48, '🐟'],
          ['金枪鱼寿司', '赤身 · 油脂丰盈', 28, '🍣'],
          ['甜虾握寿司', '鲜甜弹牙', 22, '🍤'],
          ['加州卷', '蟹肉沙拉 · 8 件', 32, '🍥']
        ]
      ],
      [
        '热食',
        '🍜',
        [
          ['豚骨拉面', '12 小时熬制汤底', 38, '🍜'],
          ['日式炸鸡块', '外酥里嫩', 26, '🍗'],
          ['茶碗蒸', '鲜香滑嫩', 16, '🥘']
        ]
      ],
      [
        '定食',
        '🍱',
        [
          ['刺身定食', '主食 + 刺身 + 味噌汤', 68, '🍱'],
          ['照烧鸡排饭', '秘制酱汁', 42, '🍛']
        ]
      ]
    ]
  },
  {
    id: '4',
    name: '茶语时光',
    image: '🧋',
    category: '奶茶饮品',
    rating: 4.5,
    ratingCount: 3521,
    sales: 2100,
    distance: 900,
    fee: 2,
    min: 12,
    lead: 20,
    brand: true,
    announcement: '真奶真茶，拒绝奶精。第二杯半价活动进行中。',
    address: '徐汇区美罗城 5 楼',
    activities: [
      { icon: '减', tips: '第二杯半价' },
      { icon: '首', tips: '首单立减 3 元' }
    ],
    menu: [
      [
        '招牌奶茶',
        '🧋',
        [
          ['黑糖珍珠鲜奶', '现熬珍珠 · 焦香黑糖', 18, '🧋'],
          ['芝芝莓莓', '草莓果肉 · 芝士奶盖', 24, '🍓'],
          ['多肉葡萄', '手剥果肉 · 清爽', 22, '🍇'],
          ['杨枝甘露', '港式经典', 20, '🥭']
        ]
      ],
      [
        '纯茶水果',
        '🍵',
        [
          ['手打柠檬茶', '香水柠檬 · 暴打', 15, '🍋'],
          ['满杯红柚', '南非西柚', 18, '🍊']
        ]
      ]
    ]
  },
  {
    id: '5',
    name: '老北京炸酱面',
    image: '🍜',
    category: '面食粥点',
    rating: 4.4,
    ratingCount: 986,
    sales: 640,
    distance: 2200,
    fee: 4,
    min: 18,
    lead: 32,
    brand: false,
    announcement: '手工现擀面条，酱料秘制，欢迎常来。',
    address: '徐汇区辛耕路 55 号',
    activities: [{ icon: '减', tips: '满 20 减 4' }],
    menu: [
      [
        '招牌面',
        '🍜',
        [
          ['老北京炸酱面', '六必居黄酱 · 手擀面', 26, '🍜'],
          ['茄丁打卤面', '北方家常味', 24, '🍆'],
          ['西红柿鸡蛋面', '酸甜开胃', 20, '🍅']
        ]
      ],
      [
        '小吃',
        '🥟',
        [
          ['猪肉白菜饺', '现包现煮 · 12 只', 18, '🥟'],
          ['凉拌黄瓜', '蒜香爽口', 8, '🥒'],
          ['卤蛋', '老汤卤制', 4, '🥚']
        ]
      ]
    ]
  },
  {
    id: '6',
    name: '轻食主义 · 沙拉',
    image: '🥗',
    category: '轻食沙拉',
    rating: 4.8,
    ratingCount: 1523,
    sales: 540,
    distance: 1400,
    fee: 5,
    min: 25,
    lead: 28,
    brand: true,
    announcement: '低卡低脂，酱料另配。健身餐首选。',
    address: '徐汇区天钥桥路 20 号',
    activities: [{ icon: '减', tips: '满 40 减 10' }],
    menu: [
      [
        '能量沙拉',
        '🥗',
        [
          ['鸡胸牛油果沙拉', '低卡高蛋白', 42, '🥑'],
          ['三文鱼藜麦碗', '超级食物搭配', 52, '🥗'],
          ['凯撒沙拉', '经典罗马生菜', 34, '🥬']
        ]
      ],
      [
        '健康饮品',
        '🥤',
        [
          ['羽衣甘蓝汁', '排毒轻体', 22, '🥤'],
          ['低脂酸奶', '无糖', 12, '🥛']
        ]
      ]
    ]
  },
  {
    id: '7',
    name: '粤点轩 · 茶餐厅',
    image: '🍵',
    category: '粤菜茶点',
    rating: 4.6,
    ratingCount: 2011,
    sales: 890,
    distance: 2600,
    fee: 6,
    min: 30,
    lead: 38,
    brand: false,
    announcement: '粤点师傅现做，早茶时段 7:00-11:00 供应。',
    address: '徐汇区衡山路 12 号',
    activities: [{ icon: '减', tips: '满 80 减 18' }],
    menu: [
      [
        '经典茶点',
        '🍵',
        [
          ['虾饺皇', '整只鲜虾 · 4 只', 28, '🥟'],
          ['豉汁凤爪', '软糯入味', 22, '🍗'],
          ['荔湾艇仔粥', '料足绵密', 20, '🥣'],
          ['流沙包', '咸蛋黄爆浆', 18, '🍞']
        ]
      ],
      [
        '烧腊主食',
        '🍛',
        [
          ['蜜汁叉烧饭', '明炉现烧', 42, '🍛'],
          ['干炒牛河', '镬气十足', 38, '🍜']
        ]
      ]
    ]
  },
  {
    id: '8',
    name: '韩宫亭 · 韩式料理',
    image: '🍱',
    category: '韩式料理',
    rating: 4.3,
    ratingCount: 768,
    sales: 480,
    distance: 3100,
    fee: 6,
    min: 35,
    lead: 40,
    brand: false,
    announcement: '正宗韩式风味，石锅拌饭免费续饭。',
    address: '徐汇区宜山路 500 号',
    activities: [{ icon: '减', tips: '满 50 减 12' }],
    menu: [
      [
        '石锅拌饭',
        '🍱',
        [
          ['石锅拌饭', '多种蔬菜 · 韩式辣酱', 36, '🍱'],
          ['泡菜五花肉拌饭', '酸辣下饭', 40, '🥘']
        ]
      ],
      [
        '韩式小食',
        '🍢',
        [
          ['炸鸡年糕', '甜辣酱 · 韩式炸鸡', 46, '🍗'],
          ['海鲜葱饼', '满满海鲜', 38, '🥞'],
          ['辛拉面', '韩式经典', 20, '🍜']
        ]
      ]
    ]
  },
  {
    id: '9',
    name: '果然鲜 · 水果捞',
    image: '🍉',
    category: '水果生鲜',
    rating: 4.7,
    ratingCount: 1102,
    sales: 610,
    distance: 800,
    fee: 3,
    min: 15,
    lead: 22,
    brand: true,
    announcement: '水果当日现切，绝不使用隔夜果切。',
    address: '徐汇区广元西路 88 号',
    activities: [{ icon: '减', tips: '满 25 减 6' }],
    menu: [
      [
        '鲜切水果',
        '🍉',
        [
          ['缤纷水果捞', '8 种水果任选', 26, '🍉'],
          ['西瓜汁', '现榨无添加', 14, '🍹'],
          ['芒果班戟', '港式甜品', 16, '🥭']
        ]
      ]
    ]
  },
  {
    id: '10',
    name: '深夜食堂 · 烧烤',
    image: '🍢',
    category: '烧烤夜宵',
    rating: 4.5,
    ratingCount: 2180,
    sales: 1340,
    distance: 1900,
    fee: 4,
    min: 25,
    lead: 35,
    brand: false,
    announcement: '营业至凌晨 2 点，夜宵好去处。炭火现烤。',
    address: '徐汇区复兴中路 33 号',
    activities: [
      { icon: '减', tips: '满 60 减 16' },
      { icon: '夜', tips: '夜间配送免配送费' }
    ],
    menu: [
      [
        '炭烤招牌',
        '🍢',
        [
          ['烤羊肉串', '内蒙古羔羊 · 5 串', 25, '🍢'],
          ['烤生蚝', '乳山生蚝 · 4 只', 38, '🦪'],
          ['烤鸡翅', '蜜汁入味 · 3 只', 21, '🍗']
        ]
      ],
      [
        '烤素海鲜',
        '🥬',
        [
          ['烤韭菜', '炭火鲜香', 10, '🥬'],
          ['烤鱿鱼', 'Q 弹有嚼劲', 24, '🦑'],
          ['锡纸花甲', '蒜香浓郁', 28, '🦪']
        ]
      ]
    ]
  }
]

export const shops = shopConfigs.map((cfg, idx) => {
  const grad = GRADIENTS[idx % GRADIENTS.length]
  return {
    id: cfg.id,
    name: cfg.name,
    image: cfg.image,
    logoColor: grad[0],
    bannerColor: grad[1],
    category: cfg.category,
    rating: cfg.rating,
    ratingCount: cfg.ratingCount,
    recentOrderNum: cfg.sales,
    distance: cfg.distance,
    deliveryFee: cfg.fee,
    minOrderAmount: cfg.min,
    leadTime: cfg.lead,
    deliveryMode: { text: cfg.lead <= 30 ? '蜂鸟快送' : '准时达', color: grad[0] },
    supports: cfg.brand ? SUPPORT_LIB : SUPPORT_LIB.slice(0, 2),
    isBrand: !!cfg.brand,
    activities: cfg.activities,
    announcement: cfg.announcement,
    address: cfg.address,
    phone: '021-8888' + (1000 + idx),
    piecewiseAgentFee: { tips: `配送费 ¥${cfg.fee}` },
    safe: {
      certified: true,
      markdown: `## 商家资质\n\n- 已通过平台资质审核\n- 食品经营许可证编号：JY31010${idx}2024\n- 员工均持有效健康证\n\n## 放心承诺\n\n1. 食材新鲜，当日采购\n2. 后厨定期消杀\n3. 支持在线支付，开具发票`
    },
    menu: buildMenu(cfg.id, cfg.menu),
    scores: {
      overall: cfg.rating,
      service: +(cfg.rating - 0.1).toFixed(1),
      food: +(cfg.rating + 0.1 > 5 ? 5 : cfg.rating + 0.1).toFixed(1),
      delivery: +(cfg.rating - 0.2).toFixed(1)
    },
    tags: [
      { name: '全部', count: cfg.ratingCount, unsatisfied: false },
      { name: '味道赞', count: Math.round(cfg.ratingCount * 0.6), unsatisfied: false },
      { name: '分量足', count: Math.round(cfg.ratingCount * 0.3), unsatisfied: false },
      { name: '配送快', count: Math.round(cfg.ratingCount * 0.25), unsatisfied: false },
      { name: '价格实惠', count: Math.round(cfg.ratingCount * 0.2), unsatisfied: false },
      { name: '服务一般', count: Math.round(cfg.ratingCount * 0.03), unsatisfied: true }
    ]
  }
})

// ---------- 评价生成 ----------
const USERNAMES = ['小*喵', '爱吃*的兔', '匿名用*88', '干饭*王', '甜*酱', '月半*圆', '匿名用*12', '美食*探', '元*少女', '夜宵*党']
const AVATARS = ['🐱', '🐰', '🐻', '🦊', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷']
const REVIEW_GOOD = [
  '分量很足，味道超预期，会回购！',
  '包装严实，送到还是热乎的，好评。',
  '味道正宗，家人都很喜欢，推荐。',
  '第二次点了，依旧稳定发挥，赞。',
  '食材新鲜，处理得干净，吃得放心。',
  '配送很快，骑手态度也很好。',
  '性价比很高，这个价位很满意。',
  '颜值在线，味道也好，拍照好看。'
]
const REVIEW_BAD = [
  '这次稍微咸了一点，希望改进。',
  '配送比预计慢了一会儿，其他还好。',
  '汤洒了一点，不影响味道。'
]

export function generateRatings(shop, count, offset, tagName) {
  const list = []
  for (let i = 0; i < count; i += 1) {
    const seed = offset + i
    const isBad = seed % 11 === 5
    const pool = isBad ? REVIEW_BAD : REVIEW_GOOD
    const foods = shop.menu.flatMap((c) => c.foods)
    const picked = [foods[seed % foods.length], foods[(seed + 3) % foods.length]].filter(
      Boolean
    )
    list.push({
      id: `${shop.id}-r${seed}`,
      username: USERNAMES[seed % USERNAMES.length],
      avatar: AVATARS[seed % AVATARS.length],
      rating: isBad ? 3 : 5,
      text: pool[seed % pool.length],
      timeAgo: `${(seed % 30) + 1} 天前`,
      orderItems: picked.map((f) => f.name),
      images: []
    })
  }
  return list
}

// ---------- 用户 / 地址 / 订单 ----------
export const mockUser = {
  id: 'u1001',
  username: '知味用户',
  avatar: '🙂',
  balance: 12800, // 分
  points: 2360,
  giftAmount: 3
}

export const mockAddresses = [
  {
    id: 'a1',
    name: '张先生',
    phone: '138****8888',
    tag: '家',
    address: '徐家汇 · 汇金百货',
    detail: '肇嘉浜路 1000 号 12 楼 1201',
    geohash: '31.22299,121.36025',
    sex: 1
  },
  {
    id: 'a2',
    name: '李女士',
    phone: '139****6666',
    tag: '公司',
    address: '人民广场 · 来福士',
    detail: '西藏中路 268 号 8 楼',
    geohash: '31.23221,121.46921',
    sex: 0
  }
]

export const mockOrders = [
  {
    id: 'o9001',
    shopName: '川香居 · 麻辣香锅',
    shopImage: '🌶️',
    shopLogoColor: '#ff5a3c',
    status: '已完成',
    statusCode: 'DONE',
    total: 56,
    timeAgo: '3 天前',
    address: '徐家汇 · 汇金百货 12 楼',
    foods: [
      { name: '招牌麻辣香锅', quantity: 1, price: 38 },
      { name: '精品肥牛', quantity: 1, price: 22 }
    ]
  },
  {
    id: 'o9002',
    shopName: '茶语时光',
    shopImage: '🧋',
    shopLogoColor: '#c084fc',
    status: '配送中',
    statusCode: 'DELIVERING',
    total: 39,
    timeAgo: '今天 12:30',
    address: '人民广场 · 来福士 8 楼',
    foods: [
      { name: '黑糖珍珠鲜奶', quantity: 2, price: 18 },
      { name: '杨枝甘露', quantity: 1, price: 20 }
    ]
  }
]

// ---------- 权益 / 内容 ----------
export const mockHongbaos = [
  { id: 'h1', amount: 5, limitMap: 30, name: '满 30 可用', expireAt: '2026-12-31' },
  { id: 'h2', amount: 8, limitMap: 50, name: '满 50 可用', expireAt: '2026-11-20' },
  { id: 'h3', amount: 3, limitMap: 20, name: '满 20 可用', expireAt: '2026-10-30' }
]

export const mockExpiredHongbaos = [
  { id: 'he1', amount: 10, limitMap: 60, name: '已过期', expireAt: '2026-08-01' }
]

export const mockPoints = {
  total: 2360,
  history: [
    { id: 'p1', type: '获得', amount: 60, desc: '完成订单 o9001', timeAgo: '3 天前' },
    { id: 'p2', type: '消耗', amount: 100, desc: '兑换红包', timeAgo: '1 周前' },
    { id: 'p3', type: '获得', amount: 40, desc: '完成订单 o9000', timeAgo: '2 周前' }
  ]
}

export const mockBalance = {
  amount: 128, // 元
  detail: [
    { id: 'b1', type: '充值', amount: 100, desc: '微信充值', timeAgo: '1 周前' },
    { id: 'b2', type: '消费', amount: -28, desc: '订单消费', timeAgo: '3 天前' }
  ]
}

export const quickRemarks = ['不要辣', '少辣', '多饭', '少饭', '加辣', '不要葱', '打包', '尽快送达']

export const serviceCenter = {
  categories: [
    {
      name: '账户问题',
      questions: [
        { id: 'q1', question: '如何修改绑定手机号？', answer: '进入「我的 → 设置 → 账号与安全」，按提示验证后即可更换手机号。' },
        { id: 'q2', question: '忘记密码怎么办？', answer: '在登录页点击「忘记密码」，通过短信验证码重置。' }
      ]
    },
    {
      name: '订单问题',
      questions: [
        { id: 'q3', question: '如何申请退款？', answer: '进入「订单 → 对应订单 → 申请售后」，按提示提交，客服会在 24 小时内处理。' },
        { id: 'q4', question: '配送超时怎么办？', answer: '超时订单可申请「准时宝」赔付，具体以订单页面展示为准。' }
      ]
    },
    {
      name: '会员与优惠',
      questions: [
        { id: 'q5', question: '会员卡如何开通？', answer: '进入「我的 → 会员卡」，选择套餐并支付即可开通，享多重新人礼。' },
        { id: 'q6', question: '红包如何使用？', answer: '结算时在红包列表勾选可用红包，满足门槛将自动抵扣。' }
      ]
    }
  ]
}

export const vipDescription = {
  title: '会员特权说明',
  privileges: [
    { icon: '🎁', name: '每月红包', desc: '每月赠送 5 张无门槛红包' },
    { icon: '🚀', name: '优先配送', desc: '高峰期优先派单' },
    { icon: '💰', name: '专享折扣', desc: '部分商家会员价' },
    { icon: '🎂', name: '生日礼遇', desc: '生日当月双倍积分' }
  ],
  plans: [
    { id: 'm1', name: '连续包月', price: 15, originPrice: 20 },
    { id: 'm2', name: '连续包季', price: 45, originPrice: 60 },
    { id: 'm3', name: '年卡', price: 168, originPrice: 240 }
  ]
}
