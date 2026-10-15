<template>
  <div class="page">
    <header class="page__bar">
      <button type="button" class="page__back" aria-label="返回" @click="goBack">
        <svg viewBox="0 0 24 24" width="60%" height="60%"><path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <h1 class="page__title ellipsis">{{ title }}</h1>
      <div class="page__right"><slot name="right" /></div>
    </header>
    <div class="page__body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageScaffold',
  props: {
    title: { type: String, default: '' },
    backTo: String
  },
  methods: {
    goBack() {
      if (this.backTo) {
        this.$router.replace(this.backTo)
        return
      }
      if (window.history.length > 1) this.$router.back()
      else this.$router.replace('/home')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: $bg-page;
}

.page__bar {
  position: sticky;
  top: 0;
  z-index: 20;
  @include wh(100%, $page-head-h);
  display: flex;
  align-items: center;
  gap: $space-md;
  padding: 0 $content-pad;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid $border-color;
}

.page__back {
  @include wh(34, 34);
  @include flex-center;
  color: $text-body;
  border-radius: $radius-md;
  flex-shrink: 0;
  &:hover {
    background: $bg-hover;
    color: $text-title;
  }
}

.page__title {
  flex: 1;
  text-align: left;
  @include sc(17, $text-title);
  font-weight: 600;
}

.page__right {
  min-width: rem(34);
  display: flex;
  justify-content: flex-end;
  gap: $space-sm;
}

.page__body {
  flex: 1;
}
</style>
