<template>
  <img
    class="icon-img"
    :class="[`icon-img--${size}`, { 'icon-img--round': round }]"
    :src="src"
    :alt="alt || name"
    aria-hidden="true"
    draggable="false"
    @error="onError"
  />
</template>

<script>
export default {
  name: 'IconImg',
  props: {
    name: { type: String, required: true },
    size: { type: String, default: 'md' }, // sm | md | lg | xl | xxl
    round: Boolean,
    alt: String
  },
  computed: {
    src() {
      return `/icons/${this.name}.png`
    }
  },
  methods: {
    onError(e) {
      // 图片加载失败时隐藏，避免裂图影响界面
      e.target.style.visibility = 'hidden'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

.icon-img {
  display: inline-block;
  object-fit: contain;
  vertical-align: middle;
  flex-shrink: 0;
  transition: transform $transition-fast, opacity $transition-fast;

  &--sm { width: 16px; height: 16px; }
  &--md { width: 20px; height: 20px; }
  &--lg { width: 24px; height: 24px; }
  &--xl { width: 32px; height: 32px; }
  &--xxl { width: 56px; height: 56px; }

  &--round {
    border-radius: 50%;
    background: $bg-hover;
    padding: 2px;
  }
}
</style>
