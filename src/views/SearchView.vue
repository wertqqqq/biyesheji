<template>
  <div class="search">
    <header class="search__bar">
      <button type="button" class="search__back" aria-label="返回" @click="goBack">
        <svg viewBox="0 0 24 24" width="60%" height="60%"><path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="search__input">
        <icon-img name="sousuo" size="md" />
        <input
          ref="inputEl"
          v-model="keyword"
          type="search"
          enterkeyhint="search"
          placeholder="搜索商家、美食"
          @keyup.enter="submit"
          @input="onInput"
        />
        <button v-if="keyword" type="button" class="search__clear" aria-label="清空" @click="clearKeyword">✕</button>
      </div>
      <button type="button" class="search__submit" @click="submit">搜索</button>
    </header>

    <div class="search__body">
      <!-- 搜索前：历史 + 热门 -->
      <template v-if="!searched">
        <section v-if="history.length" class="search__section">
          <div class="search__section-head">
            <h3>搜索历史</h3>
            <button type="button" class="search__clear-history" @click="clearHistory">🗑 清空</button>
          </div>
          <div class="search__tags">
            <button v-for="(h, i) in history" :key="i" type="button" class="tag" @click="quick(h)">{{ h }}</button>
          </div>
        </section>
        <section class="search__section">
          <h3 class="search__section-head search__section-head--plain">热门搜索</h3>
          <div class="search__tags">
            <button v-for="h in hotWords" :key="h" type="button" class="tag tag--hot" @click="quick(h)">{{ h }}</button>
          </div>
        </section>
      </template>

      <!-- 搜索中 / 结果 -->
      <template v-else>
        <div v-if="loading" class="search__state"><loading-block text="搜索中…" /></div>
        <error-block v-else-if="error" :text="error" @retry="submit" />
        <empty-block
          v-else-if="!results.length"
          icon="sousuo"
          :text="`没有找到与「${keyword}」相关的商家`"
          subtext="换个关键词试试"
        />
        <div v-else class="search__results">
          <p class="search__count">为你找到 {{ results.length }} 家商家</p>
          <shop-card v-for="s in results" :key="s.id" :shop="s" @click="goDetail" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import router from '@/router'
import store from '@/stores'
import { shopApi } from '@/api/modules/shop'
import ShopCard from '@/components/business/ShopCard.vue'
import LoadingBlock from '@/components/base/LoadingBlock.vue'
import ErrorBlock from '@/components/base/ErrorBlock.vue'
import EmptyBlock from '@/components/base/EmptyBlock.vue'
import IconImg from '@/components/base/IconImg.vue'

const HISTORY_KEY = 'zhiwei_search_history'
const HOT_WORDS = ['麻辣香锅', '奶茶', '寿司', '炸鸡', '轻食沙拉', '烧烤', '水果捞', '炸酱面']

export default {
  name: 'SearchView',
  components: { ShopCard, LoadingBlock, ErrorBlock, EmptyBlock, IconImg },
  setup() {
    const inputEl = ref(null)
    const keyword = ref('')
    const searched = ref(false)
    const loading = ref(false)
    const error = ref('')
    const results = ref([])
    const history = ref(readHistory())
    const hotWords = HOT_WORDS
    let debounceTimer = null

    onMounted(() => {
      if (inputEl.value) inputEl.value.focus()
    })

    function readHistory() {
      try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []
      } catch {
        return []
      }
    }
    function pushHistory(kw) {
      const list = readHistory().filter((k) => k !== kw)
      list.unshift(kw)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 10)))
      history.value = list.slice(0, 10)
    }

    async function doSearch() {
      const kw = keyword.value.trim()
      if (!kw) {
        searched.value = false
        return
      }
      searched.value = true
      loading.value = true
      error.value = ''
      try {
        const geohash = store.getters['location/geohash']
        results.value = (await shopApi.search(geohash, kw)) || []
        pushHistory(kw)
      } catch (e) {
        error.value = e.message || '搜索失败，请重试'
        results.value = []
      } finally {
        loading.value = false
      }
    }

    function submit() {
      doSearch()
    }
    function onInput() {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        if (keyword.value.trim()) doSearch()
        else searched.value = false
      }, 400)
    }
    function clearKeyword() {
      keyword.value = ''
      searched.value = false
      results.value = []
      if (inputEl.value) inputEl.value.focus()
    }
    function quick(kw) {
      keyword.value = kw
      doSearch()
    }
    function clearHistory() {
      localStorage.removeItem(HISTORY_KEY)
      history.value = []
    }
    function goDetail(shop) {
      router.push(`/shops/${shop.id}`)
    }
    function goBack() {
      if (window.history.length > 1) router.back()
      else router.replace('/home')
    }

    return {
      inputEl,
      keyword,
      searched,
      loading,
      error,
      results,
      history,
      hotWords,
      submit,
      onInput,
      clearKeyword,
      quick,
      clearHistory,
      goDetail,
      goBack
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.search {
  min-height: 100%;
  background: $bg-page;
}

.search__bar {
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
.search__back {
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
.search__input {
  flex: 1;
  display: flex;
  align-items: center;
  gap: $space-sm;
  height: 44px;
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
.search__clear {
  @include wh(22, 22);
  @include flex-center;
  @include sc(12, #fff);
  background: $text-placeholder;
  border-radius: 50%;
  flex-shrink: 0;
  &:hover {
    background: $text-secondary;
  }
}
.search__submit {
  padding: 9px $space-xl;
  @include sc(14, #fff);
  font-weight: 600;
  background: linear-gradient(135deg, $color-primary, $color-primary-600);
  border-radius: $radius-pill;
  box-shadow: 0 2px 8px rgba(255, 83, 57, 0.28);
  flex-shrink: 0;
  &:hover {
    filter: brightness(1.06);
  }
}

.search__body {
  padding: $space-xl $content-pad;
  max-width: 1200px;
}
.search__section {
  margin-bottom: $space-xl;
}
.search__section-head {
  @include flex-between;
  @include sc(16, $text-title);
  font-weight: 600;
  margin-bottom: $space-md;
  &--plain {
    display: block;
  }
}
.search__clear-history {
  @include sc(13, $text-secondary);
  font-weight: 400;
  padding: 4px 10px;
  border-radius: $radius-sm;
  &:hover {
    background: $bg-hover;
    color: $color-danger;
  }
}
.search__tags {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
}
.tag {
  padding: 7px 16px;
  @include sc(14, $text-body);
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-pill;
  transition: all $transition-fast;
  &:hover {
    border-color: $color-primary;
    color: $color-primary;
    transform: translateY(-1px);
  }
  &--hot {
    color: $color-primary-600;
    background: $color-primary-soft;
    border-color: rgba(255, 83, 57, 0.18);
  }
}

.search__state {
  padding-top: rem(60);
}
.search__results {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: $space-lg;
  align-items: start;
}
.search__count {
  grid-column: 1 / -1;
  @include sc(14, $text-secondary);
  padding-bottom: $space-xs;
}
</style>
