<template>
  <page-scaffold title="搜索地址">
    <div class="search-addr">
      <div class="search-addr__bar">
        <icon-img name="sousuo" size="md" />
        <input v-model="keyword" type="search" placeholder="请输入地点关键词" @input="onInput" />
      </div>

      <div v-if="loading" class="search-addr__state"><loading-block text="搜索中…" /></div>
      <empty-block v-else-if="!results.length && searched" icon="🗺️" text="没有找到相关地点" subtext="换个关键词试试" />

      <div v-else class="search-addr__list">
        <button
          v-for="(p, i) in results"
          :key="i"
          type="button"
          class="place"
          @click="pick(p)"
        >
          <span class="place__name">{{ p.name }}</span>
          <span class="place__addr ellipsis">{{ p.address }}</span>
        </button>
      </div>
    </div>
  </page-scaffold>
</template>

<script>
import { onMounted, ref } from 'vue'
import router from '@/router'
import store from '@/stores'
import { cityApi } from '@/api/modules/city'
import PageScaffold from '@/components/base/PageScaffold.vue'
import LoadingBlock from '@/components/base/LoadingBlock.vue'
import EmptyBlock from '@/components/base/EmptyBlock.vue'
import IconImg from '@/components/base/IconImg.vue'

export default {
  name: 'SearchAddressView',
  components: { PageScaffold, LoadingBlock, EmptyBlock, IconImg },
  setup() {
    const keyword = ref('')
    const results = ref([])
    const loading = ref(false)
    const searched = ref(false)
    let timer = null

    async function doSearch() {
      loading.value = true
      try {
        results.value = (await cityApi.nearbyPlaces(keyword.value.trim())) || []
        searched.value = true
      } catch {
        results.value = []
      } finally {
        loading.value = false
      }
    }
    onMounted(doSearch)

    function onInput() {
      if (timer) clearTimeout(timer)
      timer = setTimeout(doSearch, 300)
    }
    function pick(place) {
      store.dispatch('checkout/setPickedPlace', place)
      router.back()
    }

    return { keyword, results, loading, searched, onInput, pick }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.search-addr {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: $space-lg;
  align-items: start;
  padding: $space-lg $content-pad $space-2xl;
}
.search-addr__bar {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: $space-sm;
  padding: 10px 14px;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  transition: border-color $transition-fast, box-shadow $transition-fast;
  &:focus-within {
    border-color: $color-primary;
    box-shadow: 0 0 0 3px rgba(255, 83, 57, 0.12);
  }
  input {
    flex: 1;
    @include sc(14, $text-title);
    &::placeholder {
      color: $text-placeholder;
    }
  }
}
.search-addr__state {
  grid-column: 1 / -1;
  padding-top: $space-xl;
}
.search-addr__list {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: $space-lg;
  align-items: start;
}
.place {
  display: flex;
  flex-direction: column;
  gap: $space-xs;
  width: 100%;
  padding: $card-pad;
  text-align: left;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  cursor: pointer;
  transition: border-color $transition-fast, box-shadow $transition-fast,
    background $transition-fast;
  &:hover {
    background: $bg-hover;
    border-color: rgba(255, 83, 57, 0.35);
    box-shadow: $shadow-card-hover;
  }
  &__name {
    @include sc(15, $text-title);
    font-weight: 600;
  }
  &__addr {
    @include sc(13, $text-secondary);
  }
}
</style>
