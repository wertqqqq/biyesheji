<template>
  <div class="app-shell">
    <!-- ===== 左侧侧边栏导航 ===== -->
    <aside class="app-side">
      <div class="app-side__brand">
        <brand-logo variant="mark" class="app-side__brandlogo" />
        <div class="app-side__brand-text">
          <strong>知味</strong>
          <span>外卖点餐平台</span>
        </div>
      </div>

      <nav class="app-side__scroll" aria-label="主导航">
        <p class="app-side__group">导航</p>
        <router-link
          v-for="item in primaryNav"
          :key="item.path"
          :to="item.path"
          class="side-link"
          active-class="is-active"
        >
          <icon-img class="side-link__icon" :name="item.icon" size="md" />
          <span class="side-link__label">{{ item.label }}</span>
        </router-link>

        <p class="app-side__group">我的服务</p>
        <router-link
          v-for="item in secondaryNav"
          :key="item.path"
          :to="item.path"
          class="side-link"
          active-class="is-active"
        >
          <icon-img class="side-link__icon" :name="item.icon" size="md" />
          <span class="side-link__label">{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="app-side__foot">
        <button type="button" class="app-side__city" @click="goCity">
          <icon-img name="dingwei" size="sm" />
          <span class="ellipsis">{{ cityName }}</span>
          <span class="app-side__caret" aria-hidden="true">▾</span>
        </button>
        <p class="app-side__ver">知味 v1.0 · 让好味道触手可及</p>
      </div>
    </aside>

    <!-- ===== 右侧：顶部导航栏 + 全屏内容区 ===== -->
    <div class="app-body">
      <header class="app-topbar">
        <button type="button" class="topbar__city" @click="goCity">
          <icon-img name="dingwei" size="sm" />
          <span class="ellipsis">{{ cityName }}</span>
          <span class="topbar__caret" aria-hidden="true">▾</span>
        </button>

        <button type="button" class="topbar__search" @click="goSearch">
          <icon-img class="topbar__search-icon" name="sousuo" size="sm" />
          <span>搜索商家或美食</span>
        </button>

        <div class="topbar__actions">
          <router-link to="/orders" class="topbar__action">
            <icon-img name="dingdan" size="sm" />
            <span>订单</span>
          </router-link>
          <router-link :to="userPath" class="topbar__user">
            <icon-img class="topbar__avatar" :name="avatarIcon" size="md" />
            <span class="topbar__username ellipsis">{{ displayName }}</span>
          </router-link>
        </div>
      </header>

      <main class="app-main">
        <transition name="fade" mode="out-in">
          <keep-alive :include="keepAliveViews">
            <router-view />
          </keep-alive>
        </transition>
      </main>
    </div>

    <toast-host />
  </div>
</template>

<script>
import ToastHost from './components/base/ToastHost.vue'
import BrandLogo from './components/base/BrandLogo.vue'
import IconImg from './components/base/IconImg.vue'
import router from './router'
import store from './stores'

export default {
  name: 'AppRoot',
  components: { ToastHost, BrandLogo, IconImg },
  data() {
    return {
      primaryNav: [
        { label: '首页', icon: 'shouye', path: '/home' },
        { label: '附近商家', icon: 'fujinshangjia', path: '/shops' },
        { label: '分类美食', icon: 'plate-utensils', path: '/food' },
        { label: '我的订单', icon: 'dingdan', path: '/orders' },
        { label: '我的', icon: 'wode', path: '/account' }
      ],
      secondaryNav: [
        { label: '收货地址', icon: 'shouhuodizhiyebianji', path: '/account/addresses' },
        { label: '我的优惠', icon: 'youhuiquan', path: '/benefit' },
        { label: '会员卡', icon: 'huiyuanka', path: '/vipcard' },
        { label: '我的积分', icon: 'jifen', path: '/points' },
        { label: '我的余额', icon: 'zhanghuyue', path: '/balance' },
        { label: '服务中心', icon: 'fuwuzhongxin', path: '/service' },
        { label: '发现', icon: 'faxian', path: '/find' },
        { label: '下载 App', icon: 'icon_386', path: '/download' }
      ]
    }
  },
  computed: {
    keepAliveViews() {
      // 仅缓存列表页，平衡性能与内存
      return ['ShopListView']
    },
    cityName() {
      return store.getters['location/cityName'] || '选择城市'
    },
    avatar() {
      return store.getters['user/avatar'] || 'wode'
    },
    avatarIcon() {
      const a = this.avatar
      return /^[a-zA-Z0-9_-]+$/.test(a) ? a : 'wode'
    },
    displayName() {
      return store.getters['user/displayName'] || '登录 / 注册'
    },
    userPath() {
      return store.getters['user/isLoggedIn'] ? '/account' : '/login'
    }
  },
  methods: {
    goCity() {
      router.push('/city')
    },
    goSearch() {
      router.push('/search')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.app-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: $bg-page;
}

// ===== 左侧侧边栏 =====
.app-side {
  width: $sidebar-w;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, $side-bg 0%, $side-bg-deep 100%);
  border-right: 1px solid $side-border;
  color: $side-text;
}

.app-side__brand {
  display: flex;
  align-items: center;
  gap: $space-md;
  height: $topbar-h;
  flex-shrink: 0;
  padding: 0 $space-lg;
  border-bottom: 1px solid $side-border;
}
.app-side__brandlogo {
  flex-shrink: 0;
}
.app-side__brand-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  strong {
    @include sc(17, #fff);
    font-weight: 700;
    letter-spacing: 1px;
    line-height: 1.2;
  }
  span {
    @include sc(11, $side-text);
    letter-spacing: 0.5px;
  }
}

.app-side__scroll {
  flex: 1;
  overflow-y: auto;
  padding: $space-md $space-sm $space-lg;
  @include thin-scrollbar(6px);
}
.app-side__group {
  padding: $space-lg $space-md $space-sm;
  @include sc(11, rgba(255, 255, 255, 0.38));
  letter-spacing: 1px;
  text-transform: uppercase;
}

.side-link {
  display: flex;
  align-items: center;
  gap: $space-md;
  padding: 10px $space-md;
  margin-bottom: 2px;
  border-radius: $radius-md;
  @include sc(14, $side-text);
  position: relative;
  &:hover {
    background: $side-hover;
    color: $side-text-strong;
  }
    &.is-active {
      background: $side-active;
      color: #fff;
      font-weight: 600;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 20%;
        bottom: 20%;
        width: 3px;
        border-radius: $radius-pill;
        background: $color-primary;
      }
      .side-link__icon {
        transform: scale(1.1);
        opacity: 1;
      }
    }
  &__icon {
    @include wh(22, 22);
    @include flex-center;
    flex-shrink: 0;
    transition: transform $transition-fast, opacity $transition-fast;
    // 把彩色/线框图标统一为浅色，保证深色侧栏中视觉风格一致
    filter: brightness(0) invert(1);
    opacity: 0.82;
  }
  &:hover &__icon { opacity: 1; }
  &__label {
    @include ellipsis(1);
  }
}

.app-side__foot {
  flex-shrink: 0;
  padding: $space-md;
  border-top: 1px solid $side-border;
}
.app-side__city {
  display: flex;
  align-items: center;
  gap: $space-sm;
  width: 100%;
  padding: 10px $space-md;
  border-radius: $radius-md;
  @include sc(13, $side-text);
  background: rgba(255, 255, 255, 0.05);
  &:hover {
    background: $side-hover;
    color: #fff;
  }
}
.app-side__caret {
  margin-left: auto;
  @include sc(10, rgba(255, 255, 255, 0.4));
}
.app-side__ver {
  margin-top: $space-sm;
  text-align: center;
  @include sc(11, rgba(255, 255, 255, 0.28));
}

// ===== 右侧主体 =====
.app-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-topbar {
  display: flex;
  align-items: center;
  gap: $space-lg;
  height: $topbar-h;
  flex-shrink: 0;
  padding: 0 $content-pad;
  background: $bg-card;
  border-bottom: 1px solid $border-color;
  z-index: 30;
}

.topbar__city {
  display: inline-flex;
  align-items: center;
  gap: $space-xs;
  max-width: 220px;
  padding: 8px $space-md;
  border-radius: $radius-md;
  @include sc(14, $text-title);
  font-weight: 600;
  &:hover {
    background: $bg-hover;
    color: $color-primary;
  }
}
.topbar__caret {
  @include sc(10, $text-secondary);
}

.topbar__search {
  display: flex;
  align-items: center;
  gap: $space-sm;
  flex: 1;
  max-width: 560px;
  height: 38px;
  padding: 0 $space-lg;
  border-radius: $radius-pill;
  background: $bg-page;
  border: 1px solid transparent;
  @include sc(14, $text-placeholder);
  text-align: left;
  &:hover {
    border-color: $border-strong;
    background: $bg-card;
    box-shadow: $shadow-card;
  }
  &-icon {
    opacity: 0.65;
  }
}

.topbar__actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: $space-sm;
}
.topbar__action {
  display: inline-flex;
  align-items: center;
  gap: $space-xs;
  padding: 8px $space-md;
  border-radius: $radius-md;
  @include sc(14, $text-body);
  &:hover {
    background: $bg-hover;
    color: $text-title;
  }
}
.topbar__user {
  display: inline-flex;
  align-items: center;
  gap: $space-sm;
  padding: 6px $space-md 6px 6px;
  border-radius: $radius-pill;
  border: 1px solid $border-color;
  &:hover {
    border-color: $border-strong;
    background: $bg-hover;
  }
}
.topbar__avatar {
  @include wh(30, 30);
  @include flex-center;
  background: linear-gradient(135deg, $color-primary, $color-primary-600);
  border-radius: 50%;
  flex-shrink: 0;
  padding: 5px;
  box-sizing: border-box;
}
.topbar__username {
  max-width: 120px;
  @include sc(13, $text-body);
  font-weight: 500;
}
</style>
