<template>
  <div class="menu">
    <div class="menu__left" ref="leftRef">
      <ul class="menu__cats">
        <li
          v-for="(cat, i) in menu"
          :key="i"
          class="menu__cat"
          :class="{ 'is-active': activeIndex === i }"
          @click="clickCategory(i)"
        >
          <span class="menu__cat-icon">{{ cat.icon }}</span>
          <span class="menu__cat-name ellipsis">{{ cat.name }}</span>
        </li>
      </ul>
    </div>
    <div class="menu__right" ref="rightRef">
      <div class="menu__right-inner">
        <section v-for="(cat, i) in menu" :key="i" class="menu__group" :data-index="i">
          <h4 class="menu__group-title">
            <span class="menu__group-name">{{ cat.name }}</span>
            <span class="menu__group-desc">{{ cat.icon }}</span>
          </h4>
          <div
            v-for="food in cat.foods"
            :key="food.id"
            class="food"
            @click="$emit('food-click', food)"
          >
            <div class="food__thumb" :style="{ background: gradientFor(food) }">
              <span>{{ food.image }}</span>
            </div>
            <div class="food__info">
              <h5 class="food__name ellipsis">{{ food.name }}</h5>
              <p class="food__desc ellipsis-2">{{ food.description }}</p>
              <p class="food__meta">月售 {{ food.monthSales }} · 好评 {{ food.rating }}%</p>
              <div class="food__foot">
                <span class="food__price">¥{{ food.price.toFixed(2) }}</span>
                <quantity-stepper
                  :value="countOf(food.id)"
                  @inc="onInc($event, food)"
                  @dec="$emit('dec', food)"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import BScroll from 'better-scroll'
import QuantityStepper from '../base/QuantityStepper.vue'

const GRADIENTS = [
  ['#ffe9e3', '#ffd0c2'],
  ['#e3f2ff', '#cbe4ff'],
  ['#fff4e0', '#ffe6b8'],
  ['#e6fbef', '#c6f0d8'],
  ['#f3e8ff', '#e2ccff'],
  ['#ffe7ea', '#ffc9d2']
]

export default {
  name: 'MenuPanel',
  components: { QuantityStepper },
  props: {
    menu: { type: Array, default: () => [] },
    countOf: { type: Function, required: true }
  },
  emits: ['add', 'dec', 'food-click'],
  setup(props, { emit }) {
    const leftRef = ref(null)
    const rightRef = ref(null)
    const activeIndex = ref(0)
    let menuScroll = null
    let foodsScroll = null
    let heights = []

    function calculateHeights() {
      if (!rightRef.value) return
      const inner = rightRef.value.children[0]
      if (!inner) return
      const sections = inner.children
      let h = 0
      heights = [0]
      for (let i = 0; i < sections.length; i += 1) {
        h += sections[i].offsetHeight
        heights.push(h)
      }
    }

    function computeActive(y) {
      const scrollY = Math.abs(Math.round(y))
      for (let i = 0; i < heights.length - 1; i += 1) {
        if (scrollY >= heights[i] && scrollY < heights[i + 1]) {
          activeIndex.value = i
          return
        }
      }
    }

    function initScroll() {
      if (!props.menu.length) return
      if (menuScroll && foodsScroll) {
        nextTick(() => {
          calculateHeights()
          foodsScroll.refresh()
          menuScroll.refresh()
        })
        return
      }
      menuScroll = new BScroll(leftRef.value, { click: true })
      foodsScroll = new BScroll(rightRef.value, { probeType: 3, click: true })
      foodsScroll.on('scroll', (pos) => computeActive(pos.y))
      calculateHeights()
    }

    function clickCategory(i) {
      activeIndex.value = i
      const inner = rightRef.value.children[0]
      const target = inner.children[i]
      if (foodsScroll && target) foodsScroll.scrollToElement(target, 260)
      const leftItem = leftRef.value.children[0].children[i]
      if (menuScroll && leftItem) menuScroll.scrollToElement(leftItem, 300, 0, -60)
    }

    function onInc(e, food) {
      emit('add', { event: e, food })
    }

    function gradientFor(food) {
      const idx = (food.id || '').length % GRADIENTS.length
      const [a, b] = GRADIENTS[idx]
      return `linear-gradient(135deg, ${a}, ${b})`
    }

    onMounted(() => {
      if (props.menu.length) nextTick(initScroll)
    })
    onUnmounted(() => {
      if (menuScroll) menuScroll.destroy()
      if (foodsScroll) foodsScroll.destroy()
    })
    watch(
      () => props.menu,
      () => {
        activeIndex.value = 0
        nextTick(initScroll)
      }
    )

    return { leftRef, rightRef, activeIndex, clickCategory, onInc, countOf: props.countOf, gradientFor }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.menu {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.menu__left {
  width: 200px;
  height: 100%;
  overflow: hidden;
  background: $bg-page;
  border-right: 1px solid $border-color;
  flex-shrink: 0;
}
.menu__cats {
  padding-bottom: 140px;
}
.menu__cat {
  display: flex;
  align-items: center;
  gap: $space-sm;
  padding: 14px $space-lg;
  @include sc(14, $text-body);
  border-left: 3px solid transparent;
  cursor: pointer;
  transition: background-color $transition-fast, color $transition-fast;
  &:hover {
    background: rgba(255, 255, 255, 0.7);
    color: $text-title;
  }
  &.is-active {
    background: $bg-card;
    color: $text-title;
    font-weight: 600;
    border-left-color: $color-primary;
  }
}
.menu__cat-icon {
  @include sc(16, $text-body);
}

.menu__right {
  flex: 1;
  height: 100%;
  overflow: hidden;
  background: $bg-card;
}
.menu__right-inner {
  padding-bottom: 150px;
}
.menu__group-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: $space-lg $space-xl $space-sm;
  &-name {
    @include sc(16, $text-title);
    font-weight: 700;
  }
  &-desc {
    @include sc(13, $text-placeholder);
  }
}

.food {
  display: flex;
  gap: $space-lg;
  padding: $space-md $space-xl;
  cursor: pointer;
  transition: background-color $transition-fast;
  &:hover {
    background: $bg-hover;
  }
  &__thumb {
    @include wh(88, 88);
    @include flex-center;
    border-radius: $radius-md;
    flex-shrink: 0;
    span {
      @include sc(40, #fff);
    }
  }
  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: $space-xs;
  }
  &__name {
    @include sc(16, $text-title);
    font-weight: 600;
  }
  &__desc {
    @include sc(13, $text-secondary);
    @include ellipsis(2);
  }
  &__meta {
    @include sc(12, $text-placeholder);
  }
  &__foot {
    @include flex-between;
    margin-top: $space-xs;
  }
  &__price {
    @include sc(20, $color-primary);
    font-weight: 700;
  }
}
</style>
