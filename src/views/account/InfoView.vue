<template>
  <div class="info">
    <header class="info__bar">
      <button type="button" class="info__back" aria-label="返回" @click="back">
        <svg viewBox="0 0 24 24" width="60%" height="60%"><path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <span>个人资料</span>
    </header>

    <div v-if="!isLoggedIn" class="info__guest">
      <empty-block icon="🔐" text="登录后查看资料">
        <app-button type="primary" size="sm" @click="$router.push('/login')">去登录</app-button>
      </empty-block>
    </div>

    <template v-else>
      <div class="info__profile">
        <span class="info__avatar">{{ avatar }}</span>
        <div class="info__id">
          <p class="info__name">{{ displayName }}</p>
          <p class="info__uid">ID：{{ userId }}</p>
        </div>
      </div>

      <div class="info__stats">
        <div class="stat"><b>{{ balanceYuan }}</b><span>余额</span></div>
        <div class="stat"><b>{{ points }}</b><span>积分</span></div>
        <div class="stat"><b>{{ gift }}</b><span>红包</span></div>
      </div>

      <div class="info__rows">
        <button type="button" class="row" @click="$router.push('/account/info/username')">
          <span>用户名</span><span class="row__val">{{ displayName }} ›</span>
        </button>
        <button type="button" class="row" @click="$router.push('/account/addresses')">
          <span>收货地址</span><span class="row__val">管理 ›</span>
        </button>
        <button type="button" class="row" @click="$router.push('/orders')">
          <span>我的订单</span><span class="row__val">查看 ›</span>
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import { computed } from 'vue'
import router from '@/router'
import store from '@/stores'
import { fenToYuan } from '@/utils/format'
import AppButton from '@/components/base/AppButton.vue'
import EmptyBlock from '@/components/base/EmptyBlock.vue'

export default {
  name: 'InfoView',
  components: { AppButton, EmptyBlock },
  setup() {
    const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])
    const avatar = computed(() => store.getters['user/avatar'])
    const displayName = computed(() => store.getters['user/displayName'])
    const userId = computed(() => store.getters['user/userId'])
    const user = computed(() => store.state.user.userInfo || {})
    const balanceYuan = computed(() => fenToYuan(user.value.balance))
    const points = computed(() => user.value.points || 0)
    const gift = computed(() => user.value.giftAmount || 0)

    function back() {
      router.back()
    }

    return { isLoggedIn, avatar, displayName, userId, balanceYuan, points, gift, back }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.info {
  min-height: 100%;
  padding-bottom: $space-2xl;
  background: $bg-page;
}
.info__bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: $space-md;
  @include wh(100%, $page-head-h);
  padding: 0 $content-pad;
  @include sc(17, $text-title);
  font-weight: 600;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid $border-color;
}
.info__back {
  @include wh(34, 34);
  @include flex-center;
  flex-shrink: 0;
  color: $text-body;
  border-radius: $radius-md;
  transition: background $transition-fast, color $transition-fast;
  &:hover {
    background: $bg-hover;
    color: $text-title;
  }
}
.info__guest {
  padding: rem(96) 0;
}

.info__profile {
  display: flex;
  align-items: center;
  gap: $space-lg;
  margin: $space-lg $content-pad 0;
  padding: $space-xl;
  background: linear-gradient(135deg, $color-primary, $color-primary-600);
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
}
.info__avatar {
  @include wh(72, 72);
  @include flex-center;
  @include sc(28, #fff);
  font-weight: 700;
  background: rgba(255, 255, 255, 0.24);
  border-radius: 50%;
}
.info__name {
  @include sc(20, #fff);
  font-weight: 700;
}
.info__uid {
  margin-top: $space-xs;
  @include sc(13, rgba(255, 255, 255, 0.85));
}

.info__stats {
  display: flex;
  margin: $space-lg $content-pad 0;
  padding: $space-lg 0;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
}
.stat {
  flex: 1;
  text-align: center;
  b {
    display: block;
    @include sc(24, $text-title);
    font-weight: 800;
  }
  span {
    @include sc(13, $text-secondary);
  }
}

.info__rows {
  margin: $space-lg $content-pad 0;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  overflow: hidden;
}
.row {
  @include flex-between;
  width: 100%;
  padding: rem(14) $card-pad;
  @include sc(14, $text-body);
  border-bottom: 1px solid $border-color;
  transition: background $transition-fast;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: $bg-hover;
  }
  &__val {
    color: $text-secondary;
    transition: color $transition-fast;
  }
  &:hover &__val {
    color: $color-primary;
  }
}
</style>
