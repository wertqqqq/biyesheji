<template>
  <div class="notfound">
    <div class="notfound__code">404</div>
    <p class="notfound__text">页面走丢啦～</p>
    <app-button type="primary" @click="goHome">回到首页</app-button>
  </div>
</template>

<script>
import router from '@/router'
import AppButton from '@/components/base/AppButton.vue'

export default {
  name: 'NotFoundView',
  components: { AppButton },
  setup() {
    function goHome() {
      router.replace('/home')
    }
    return { goHome }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.notfound {
  min-height: 100%;
  @include flex-center(column);
  gap: $space-lg;
  background: $bg-page;
}
.notfound__code {
  @include sc(96, $color-primary);
  font-weight: 800;
  letter-spacing: 4px;
  text-shadow: 0 8px 24px rgba(255, 83, 57, 0.25);
}
.notfound__text {
  @include sc(16, $text-secondary);
  margin-bottom: $space-md;
}
</style>
