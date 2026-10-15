<template>
  <div class="loading" :class="{ 'loading--inline': inline }">
    <span class="loading__spinner" aria-hidden="true" />
    <span v-if="text" class="loading__text">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'LoadingBlock',
  props: {
    text: { type: String, default: '' },
    inline: Boolean
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: rem(60) 0;
  gap: $space-md;
  color: $text-secondary;
  &--inline {
    flex-direction: row;
    padding: $space-md 0;
  }
  &__spinner {
    width: rem(32);
    height: rem(32);
    border: 3px solid $border-color;
    border-top-color: $color-primary;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  &__text {
    @include sc(13, $text-secondary);
  }
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
