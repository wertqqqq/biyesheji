<template>
  <button
    class="app-btn"
    :class="[`app-btn--${type}`, `app-btn--${size}`, { 'app-btn--block': block, 'is-disabled': disabled || loading }]"
    :disabled="disabled || loading"
    @click="onClick"
  >
    <span v-if="loading" class="app-btn__spinner" aria-hidden="true" />
    <span class="app-btn__label"><slot>{{ text }}</slot></span>
  </button>
</template>

<script>
export default {
  name: 'AppButton',
  props: {
    type: { type: String, default: 'primary' }, // primary | ghost | plain | danger
    size: { type: String, default: 'md' }, // lg | md | sm
    block: Boolean,
    disabled: Boolean,
    loading: Boolean,
    text: String
  },
  methods: {
    onClick(e) {
      if (this.disabled || this.loading) return
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.app-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-sm;
  border-radius: $radius-md;
  font-weight: 600;
  transition: transform $transition-fast, box-shadow $transition-fast,
    opacity $transition-fast, filter $transition-fast;
  white-space: nowrap;
  &:hover:not(.is-disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 83, 57, 0.28);
  }
  &:active:not(.is-disabled) {
    transform: translateY(0);
    filter: brightness(0.96);
  }
  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &--block {
    display: flex;
    width: 100%;
  }
  &--lg {
    padding: 12px 24px;
    @include sc(15, #fff);
    border-radius: $radius-lg;
  }
  &--md {
    padding: 9px 20px;
    @include sc(14, #fff);
  }
  &--sm {
    padding: 6px 14px;
    @include sc(13, #fff);
    border-radius: $radius-sm;
  }
  &--primary {
    background: linear-gradient(135deg, $color-primary, $color-primary-600);
    color: #fff;
    box-shadow: 0 2px 6px rgba(255, 83, 57, 0.24);
  }
  &--danger {
    background: $color-danger;
    color: #fff;
    &:hover:not(.is-disabled) {
      box-shadow: 0 4px 12px rgba(229, 72, 77, 0.3);
    }
  }
  &--ghost {
    background: $color-primary-100;
    color: $color-primary-600;
    &:hover:not(.is-disabled) {
      background: $color-primary;
      color: #fff;
      box-shadow: 0 4px 12px rgba(255, 83, 57, 0.24);
    }
  }
  &--plain {
    background: $bg-card;
    color: $text-title;
    border: 1px solid $border-color;
    &:hover:not(.is-disabled) {
      border-color: $color-primary;
      color: $color-primary;
      box-shadow: 0 2px 8px rgba(16, 24, 40, 0.08);
    }
  }
}

.app-btn__spinner {
  width: rem(24);
  height: rem(24);
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: btn-spin 0.7s linear infinite;
}
@keyframes btn-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
