<template>
  <div class="empty">
    <icon-img v-if="isImg" class="empty__icon" :name="icon" size="xxl" />
    <div v-else class="empty__icon" aria-hidden="true">{{ icon }}</div>
    <p class="empty__text">{{ text }}</p>
    <p v-if="subtext" class="empty__sub">{{ subtext }}</p>
    <slot />
  </div>
</template>

<script>
import IconImg from './IconImg.vue'

export default {
  name: 'EmptyBlock',
  components: { IconImg },
  props: {
    icon: { type: String, default: '🍽️' },
    text: { type: String, default: '暂无内容' },
    subtext: String
  },
  computed: {
    isImg() {
      // 图标名：字母/数字/下划线/横线组合；其余按 emoji/文字原样渲染
      return /^[a-zA-Z0-9_-]+$/.test(this.icon)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: rem(72) $space-xl;
  text-align: center;
  &__icon {
    @include sc(64, $text-placeholder);
    margin-bottom: $space-lg;
  }
  &__text {
    @include sc(15, $text-body);
    font-weight: 600;
  }
  &__sub {
    margin-top: $space-sm;
    @include sc(13, $text-secondary);
  }
}
</style>
