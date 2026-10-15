<template>
  <div class="city">
    <header class="city__bar">
      <button type="button" class="city__back" aria-label="返回" @click="goBack">
        <svg viewBox="0 0 24 24" width="60%" height="60%"><path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="city__search">
        <icon-img name="sousuo" size="md" />
        <input v-model="keyword" type="search" placeholder="输入城市名或拼音" />
      </div>
    </header>

    <div class="city__body">
      <div v-if="loading" class="city__loading">
        <loading-block text="城市加载中…" />
      </div>
      <template v-else-if="error">
        <error-block :text="error" @retry="load" />
      </template>
      <template v-else>
        <div class="city__inner">
          <section v-if="guessCity" class="city__section">
            <h3 class="city__label">当前定位</h3>
            <button type="button" class="city__row city__row--current" @click="choose(guessCity)">
              <icon-img name="dingwei" size="md" /> {{ guessCity.name }}
            </button>
          </section>

          <section v-if="!keyword && hotCities.length" class="city__section">
            <h3 class="city__label">热门城市</h3>
            <div class="city__hot">
              <button
                v-for="c in hotCities"
                :key="c.id"
                type="button"
                class="city__chip"
                :class="{ 'is-on': isCurrent(c) }"
                @click="choose(c)"
              >
                {{ c.name }}
              </button>
            </div>
          </section>

          <section class="city__section">
            <h3 class="city__label">{{ keyword ? '搜索结果' : '全部城市' }}</h3>
            <div v-if="!filteredGroups.length" class="city__none">
              <empty-block icon="🏙️" text="没有找到相关城市" />
            </div>
            <div v-for="g in filteredGroups" :key="g.letter" class="city__group">
              <div class="city__letter">{{ g.letter }}</div>
              <div class="city__rows">
                <button
                  v-for="c in g.cities"
                  :key="c.id"
                  type="button"
                  class="city__row"
                  :class="{ 'is-on': isCurrent(c) }"
                  @click="choose(c)"
                >
                  {{ c.name }}
                </button>
              </div>
            </div>
          </section>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import router from '@/router'
import store from '@/stores'
import { cityApi } from '@/api/modules/city'
import LoadingBlock from '@/components/base/LoadingBlock.vue'
import ErrorBlock from '@/components/base/ErrorBlock.vue'
import EmptyBlock from '@/components/base/EmptyBlock.vue'
import IconImg from '@/components/base/IconImg.vue'

export default {
  name: 'CityPickerView',
  components: { LoadingBlock, ErrorBlock, EmptyBlock, IconImg },
  setup() {
    const keyword = ref('')
    const loading = ref(true)
    const error = ref('')
    const guessCity = ref(null)
    const hotCities = ref([])
    const groups = ref([])

    async function load() {
      loading.value = true
      error.value = ''
      try {
        const [guess, hot, grp] = await Promise.all([
          cityApi.guessCity(),
          cityApi.hotCities(),
          cityApi.cityGroups()
        ])
        guessCity.value = guess
        hotCities.value = hot || []
        groups.value = grp || []
      } catch (e) {
        error.value = e.message || '城市加载失败'
      } finally {
        loading.value = false
      }
    }
    onMounted(load)

    const currentName = computed(() => store.getters['location/cityName'])

    const filteredGroups = computed(() => {
      const kw = keyword.value.trim().toLowerCase()
      if (!kw) return groups.value
      return groups.value
        .map((g) => ({
          letter: g.letter,
          cities: g.cities.filter(
            (c) => c.name.includes(kw) || (c.abbr || '').toLowerCase().includes(kw)
          )
        }))
        .filter((g) => g.cities.length)
    })

    function isCurrent(c) {
      return currentName.value === c.name
    }

    function choose(city) {
      store.dispatch('location/selectCity', city)
      router.replace('/home')
    }

    function goBack() {
      if (window.history.length > 1) router.back()
      else router.replace('/home')
    }

    return {
      keyword,
      loading,
      error,
      guessCity,
      hotCities,
      filteredGroups,
      isCurrent,
      choose,
      goBack,
      load
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.city {
  min-height: 100%;
  background: $bg-page;
}

.city__bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: $space-md;
  padding: $space-lg $content-pad;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid $border-color;
}
.city__back {
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
.city__search {
  flex: 1;
  max-width: 560px;
  display: flex;
  align-items: center;
  gap: $space-sm;
  height: 42px;
  padding: 0 $space-lg;
  background: $bg-card;
  border: 1px solid $border-strong;
  border-radius: $radius-pill;
  transition: border-color $transition-fast, box-shadow $transition-fast;
  &:focus-within {
    border-color: $color-primary;
    box-shadow: 0 0 0 3px rgba(255, 83, 57, 0.14);
  }
  input {
    flex: 1;
    @include sc(15, $text-title);
    &::placeholder {
      color: $text-placeholder;
    }
  }
}

.city__body {
  padding-bottom: $space-xl;
}
.city__inner {
  max-width: 1200px;
  padding: 0 $content-pad;
}
.city__label {
  @include sc(14, $text-secondary);
  font-weight: 600;
  padding: $space-lg 0 $space-sm;
}
.city__row {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px $space-lg;
  @include sc(14, $text-title);
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  transition: all $transition-fast;
  &:hover {
    border-color: $color-primary;
    color: $color-primary;
  }
  &.is-on {
    color: $color-primary;
    font-weight: 700;
    border-color: $color-primary;
    background: $color-primary-soft;
  }
}
.city__row--current {
  color: $color-primary;
  font-weight: 600;
  max-width: 280px;
}
.city__hot {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: $space-sm;
}
.city__chip {
  padding: 10px $space-md;
  text-align: center;
  @include sc(14, $text-body);
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  transition: all $transition-fast;
  &:hover {
    border-color: $color-primary;
    color: $color-primary;
    transform: translateY(-1px);
  }
  &.is-on {
    color: $color-primary;
    font-weight: 700;
    border-color: $color-primary;
    background: $color-primary-soft;
  }
}
.city__group {
  margin-top: $space-md;
}
.city__letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  @include wh(32, 32);
  margin-bottom: $space-sm;
  @include sc(14, #fff);
  font-weight: 700;
  background: linear-gradient(135deg, $color-primary, $color-primary-600);
  border-radius: $radius-md;
}
.city__rows {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: $space-sm;
}
.city__none {
  padding: rem(40) 0;
}
</style>
