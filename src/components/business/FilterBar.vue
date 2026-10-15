<template>
  <div class="filterbar">
    <div class="filterbar__sorts">
      <button
        v-for="s in sorts"
        :key="s.key"
        type="button"
        class="filterbar__sort"
        :class="{ 'is-active': activeSort === s.key }"
        @click="$emit('sort', s.key)"
      >
        {{ s.label }}
      </button>
    </div>
    <button
      type="button"
      class="filterbar__filter"
      :class="{ 'is-active': hasActiveFilter }"
      @click="openSheet"
    >
      筛选
      <span v-if="hasActiveFilter" class="filterbar__dot" />
    </button>

    <transition name="sheet">
      <div v-if="sheetOpen" class="filterbar__mask" @click.self="sheetOpen = false">
        <div class="sheet">
          <div class="sheet__head">
            <span>筛选</span>
            <button type="button" class="sheet__close" aria-label="关闭" @click="sheetOpen = false">✕</button>
          </div>
          <div class="sheet__body">
            <section v-if="options.categories && options.categories.length" class="sheet__section">
              <h4>商家分类</h4>
              <div class="chips">
                <button
                  v-for="c in options.categories"
                  :key="c.id"
                  type="button"
                  class="chip"
                  :class="{ 'is-on': temp.categoryId === String(c.id) }"
                  @click="toggleCategory(c.id)"
                >
                  {{ c.icon }} {{ c.name }}
                </button>
              </div>
            </section>
            <section v-if="options.deliveryModes && options.deliveryModes.length" class="sheet__section">
              <h4>配送方式</h4>
              <div class="chips">
                <button
                  v-for="d in options.deliveryModes"
                  :key="d.id"
                  type="button"
                  class="chip"
                  :class="{ 'is-on': temp.deliveryMode === String(d.id) }"
                  @click="toggleSingle('deliveryMode', d.id)"
                >
                  {{ d.name }}
                </button>
              </div>
            </section>
            <section v-if="options.activityAttrs && options.activityAttrs.length" class="sheet__section">
              <h4>商家属性</h4>
              <div class="chips">
                <button
                  v-for="a in options.activityAttrs"
                  :key="a.id"
                  type="button"
                  class="chip"
                  :class="{ 'is-on': temp.supportIds.includes(String(a.id)) }"
                  @click="toggleMulti(a.id)"
                >
                  {{ a.name }}
                </button>
              </div>
            </section>
          </div>
          <div class="sheet__footer">
            <button type="button" class="sheet__reset" @click="resetTemp">清空</button>
            <button type="button" class="sheet__done" @click="applyFilter">查看结果</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'FilterBar',
  props: {
    options: { type: Object, default: () => ({ categories: [], deliveryModes: [], activityAttrs: [] }) },
    activeSort: { type: String, default: '' },
    activeFilters: {
      type: Object,
      default: () => ({ categoryId: '', supportIds: [], deliveryMode: '' })
    }
  },
  data() {
    return {
      sheetOpen: false,
      sorts: [
        { key: '', label: '综合排序' },
        { key: 'rating', label: '好评优先' },
        { key: 'sales', label: '销量最高' },
        { key: 'distance', label: '距离最近' }
      ],
      temp: { categoryId: '', supportIds: [], deliveryMode: '' }
    }
  },
  computed: {
    hasActiveFilter() {
      const f = this.activeFilters
      return !!f.categoryId || !!f.deliveryMode || (f.supportIds && f.supportIds.length > 0)
    }
  },
  methods: {
    openSheet() {
      this.temp = {
        categoryId: this.activeFilters.categoryId || '',
        supportIds: (this.activeFilters.supportIds || []).slice(),
        deliveryMode: this.activeFilters.deliveryMode || ''
      }
      this.sheetOpen = true
    },
    toggleCategory(id) {
      this.temp.categoryId = this.temp.categoryId === String(id) ? '' : String(id)
    },
    toggleSingle(key, id) {
      this.temp[key] = this.temp[key] === String(id) ? '' : String(id)
    },
    toggleMulti(id) {
      const s = String(id)
      const idx = this.temp.supportIds.indexOf(s)
      if (idx > -1) this.temp.supportIds.splice(idx, 1)
      else this.temp.supportIds.push(s)
    },
    resetTemp() {
      this.temp = { categoryId: '', supportIds: [], deliveryMode: '' }
    },
    applyFilter() {
      this.$emit('apply', { ...this.temp })
      this.sheetOpen = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.filterbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-lg;
  padding: $space-md $content-pad;
  background: $bg-card;
  border-bottom: 1px solid $border-color;
  &__sorts {
    display: flex;
    gap: $space-xs;
    flex: 1;
    min-width: 0;
    overflow-x: auto;
  }
  &__sort {
    position: relative;
    padding: 7px 14px;
    @include sc(14, $text-body);
    white-space: nowrap;
    border-radius: $radius-pill;
    &:hover {
      background: $bg-hover;
      color: $text-title;
    }
    &.is-active {
      color: #fff;
      font-weight: 600;
      background: linear-gradient(135deg, $color-primary, $color-primary-600);
      box-shadow: 0 2px 8px rgba(255, 83, 57, 0.28);
    }
  }
  &__filter {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: $space-xs;
    padding: 7px 16px;
    @include sc(14, $text-body);
    background: $bg-card;
    border: 1px solid $border-color;
    border-radius: $radius-pill;
    flex-shrink: 0;
    &:hover {
      border-color: $color-primary;
      color: $color-primary;
    }
    &.is-active {
      color: $color-primary-600;
      font-weight: 600;
      border-color: rgba(255, 83, 57, 0.4);
      background: $color-primary-soft;
    }
  }
  &__dot {
    @include wh(8, 8);
    background: $color-primary;
    border-radius: 50%;
  }
}

.sheet {
  &__head {
    @include flex-between;
    padding: $space-lg $content-pad;
    @include sc(17, $text-title);
    font-weight: 600;
    border-bottom: 1px solid $border-color;
  }
  &__close {
    @include wh(32, 32);
    @include flex-center;
    color: $text-secondary;
    border-radius: $radius-md;
    @include sc(14, $text-secondary);
    &:hover {
      background: $bg-hover;
      color: $text-title;
    }
  }
  &__body {
    max-height: 56vh;
    overflow-y: auto;
    padding: $space-lg $content-pad;
  }
  &__section {
    margin-bottom: $space-xl;
    h4 {
      @include sc(14, $text-title);
      margin-bottom: $space-md;
    }
  }
  &__footer {
    display: flex;
    gap: $space-md;
    padding: $space-md $content-pad;
    border-top: 1px solid $border-color;
  }
  &__reset {
    flex: 1;
    padding: 10px;
    @include sc(14, $text-body);
    background: $bg-page;
    border-radius: $radius-md;
    &:hover {
      background: $bg-active;
    }
  }
  &__done {
    flex: 2;
    padding: 10px;
    @include sc(14, #fff);
    font-weight: 600;
    background: linear-gradient(135deg, $color-primary, $color-primary-600);
    border-radius: $radius-md;
    box-shadow: 0 2px 8px rgba(255, 83, 57, 0.28);
    &:hover {
      filter: brightness(1.05);
    }
  }
}

// 桌面端：筛选由底部弹层改为居中对话框
.filterbar__mask {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: $bg-mask;
  backdrop-filter: blur(2px);
}
.sheet {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(560px, calc(100vw - 48px));
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background: $bg-card;
  border-radius: $radius-xl;
  box-shadow: $shadow-pop;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
}
.chip {
  padding: 7px 16px;
  @include sc(13, $text-body);
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-pill;
  transition: all $transition-fast;
  &:hover {
    border-color: $color-primary;
    color: $color-primary;
  }
  &.is-on {
    color: #fff;
    background: linear-gradient(135deg, $color-primary, $color-primary-600);
    border-color: transparent;
    font-weight: 600;
  }
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.2s ease;
  .sheet {
    transition: transform 0.24s ease, opacity 0.24s ease;
  }
}
.sheet-enter,
.sheet-leave-to {
  opacity: 0;
  .sheet {
    transform: translate(-50%, -50%) scale(0.92);
    opacity: 0;
  }
}
</style>
