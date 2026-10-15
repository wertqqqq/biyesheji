<template>
  <div class="errorblock">
    <div class="errorblock__icon" aria-hidden="true">😥</div>
    <p class="errorblock__text">{{ text }}</p>
    <app-button type="primary" size="sm" @click="$emit('retry')">重新加载</app-button>
  </div>
</template>

<script>
import AppButton from './AppButton.vue'

export default {
  name: 'ErrorBlock',
  components: { AppButton },
  props: {
    text: { type: String, default: '加载失败，请稍后重试' }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.errorblock {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: rem(72) $space-xl;
  gap: $space-lg;
  &__icon {
    @include sc(64, $text-placeholder);
  }
  &__text {
    @include sc(14, $text-secondary);
  }
}
</style>
