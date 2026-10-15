<template>
  <div class="account">
    <!-- 个人资料卡 -->
    <header class="account__hero">
      <button type="button" class="account__profile" @click="goProfile">
        <span class="account__avatar">
          <icon-img v-if="isIconName(avatarIcon)" :name="avatarIcon" size="xxl" />
          <template v-else>{{ avatar }}</template>
        </span>
        <span class="account__info">
          <span class="account__name">{{ displayName }}</span>
          <span class="account__sub">{{ isLoggedIn ? '查看或编辑个人资料' : '点击登录 / 注册' }}</span>
        </span>
        <span class="account__arrow" aria-hidden="true">›</span>
      </button>
      <button v-if="isLoggedIn" type="button" class="account__logout" @click="logout">退出登录</button>
    </header>

    <!-- 服务入口网格 -->
    <section class="account__grid">
      <button v-for="e in entries" :key="e.path" type="button" class="tile" @click="go(e.path)">
        <span class="tile__icon">
          <icon-img v-if="isIconName(e.icon)" :name="e.icon" size="lg" />
          <template v-else>{{ e.icon }}</template>
        </span>
        <span class="tile__name">{{ e.name }}</span>
      </button>
    </section>

    <p class="account__version">知味 · 让好味道触手可及</p>
  </div>
</template>

<script>
import { computed } from 'vue'
import router from '@/router'
import store from '@/stores'
import IconImg from '@/components/base/IconImg.vue'

export default {
  name: 'AccountView',
  components: { IconImg },
  setup() {
    const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])
    const avatar = computed(() => store.getters['user/avatar'])
    const avatarIcon = computed(() => {
      const a = avatar.value
      return /^[a-zA-Z0-9_-]+$/.test(a) ? a : 'wode'
    })
    const displayName = computed(() => store.getters['user/displayName'])

    function isIconName(str) {
      return /^[a-zA-Z0-9_-]+$/.test(str)
    }

    const entries = [
      { name: '我的订单', icon: 'dingdan', path: '/orders' },
      { name: '收货地址', icon: 'shouhuodizhiyebianji', path: '/account/addresses' },
      { name: '我的优惠', icon: 'youhuiquan', path: '/benefit' },
      { name: '会员卡', icon: 'huiyuanka', path: '/vipcard' },
      { name: '我的积分', icon: 'jifen', path: '/points' },
      { name: '我的余额', icon: 'zhanghuyue', path: '/balance' },
      { name: '服务中心', icon: 'fuwuzhongxin', path: '/service' },
      { name: '修改密码', icon: '🔑', path: '/forget' },
      { name: '发现', icon: 'faxian', path: '/find' },
      { name: '下载 App', icon: 'icon_386', path: '/download' }
    ]

    function go(path) {
      router.push(path)
    }
    function goProfile() {
      if (isLoggedIn.value) router.push('/account/info')
      else router.push('/login')
    }
    async function logout() {
      await store.dispatch('user/logout')
      router.replace('/home')
    }

    return { isLoggedIn, avatar, avatarIcon, displayName, entries, isIconName, go, goProfile, logout }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.account {
  min-height: 100%;
  background: $bg-page;
  padding: $space-xl $content-pad;
  max-width: 1200px;
}

.account__hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-lg;
  padding: $space-xl $space-2xl;
  border-radius: $radius-xl;
  background:
    radial-gradient(600px 200px at 90% 0%, rgba(255, 176, 39, 0.35), transparent 60%),
    linear-gradient(115deg, #ff6a45, $color-primary 55%, $color-primary-600);
  box-shadow: 0 10px 30px rgba(255, 83, 57, 0.25);
  overflow: hidden;
}
.account__profile {
  @include flex-between;
  gap: $space-lg;
  text-align: left;
  min-width: 0;
  flex: 1;
}
.account__avatar {
  @include wh(72, 72);
  @include flex-center;
  @include sc(36, #fff);
  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  flex-shrink: 0;
  padding: 8px;
  box-sizing: border-box;
}
.account__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: $space-xs;
}
.account__name {
  @include sc(22, #fff);
  font-weight: 700;
}
.account__sub {
  @include sc(13, rgba(255, 255, 255, 0.85));
}
.account__arrow {
  @include sc(24, rgba(255, 255, 255, 0.8));
}
.account__logout {
  padding: 8px 16px;
  @include sc(13, #fff);
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: $radius-pill;
  flex-shrink: 0;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}

.account__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: $space-md;
  margin-top: $space-lg;
  padding: $space-lg;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-xl;
  box-shadow: $shadow-card;
}
.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-sm;
  padding: $space-lg $space-sm;
  border-radius: $radius-lg;
  border: 1px solid transparent;
  transition: all $transition-fast;
  &:hover {
    background: $color-primary-soft;
    border-color: rgba(255, 83, 57, 0.18);
    transform: translateY(-2px);
    .tile__icon {
      transform: scale(1.12);
    }
  }
  &__icon {
    @include wh(48, 48);
    @include flex-center;
    @include sc(26, $text-title);
    background: $bg-hover;
    border-radius: 50%;
    transition: transform $transition-fast;
  }
  &__name {
    @include sc(13, $text-body);
    font-weight: 500;
  }
}

.account__version {
  text-align: center;
  padding: $space-2xl 0 $space-lg;
  @include sc(12, $text-placeholder);
}
</style>
