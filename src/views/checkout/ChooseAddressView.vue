<template>
  <page-scaffold title="选择地址">
    <div class="choose">
      <div v-if="loading" class="choose__state"><loading-block /></div>
      <error-block v-else-if="error" :text="error" @retry="load" />
      <empty-block v-else-if="!list.length" icon="shouhuodizhiyebianji" text="还没有收货地址" subtext="先新增一个吧" />

      <article
        v-for="a in list"
        :key="a.id"
        class="addr"
        :class="{ 'is-on': currentId === a.id }"
        @click="choose(a)"
      >
        <div class="addr__main">
          <p class="addr__name">
            {{ a.name }}
            <span v-if="a.tag" class="addr__tag">{{ a.tag }}</span>
            {{ a.phone }}
          </p>
          <p class="addr__detail ellipsis-2">{{ a.address }} {{ a.detail }}</p>
        </div>
        <span class="addr__radio" :class="{ 'is-on': currentId === a.id }" />
      </article>
    </div>

    <template #right>
      <button type="button" class="choose__add" @click="$router.push('/checkout/address/new')">新增</button>
    </template>
  </page-scaffold>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import router from '@/router'
import store from '@/stores'
import { accountApi } from '@/api/modules/account'
import PageScaffold from '@/components/base/PageScaffold.vue'
import LoadingBlock from '@/components/base/LoadingBlock.vue'
import ErrorBlock from '@/components/base/ErrorBlock.vue'
import EmptyBlock from '@/components/base/EmptyBlock.vue'

export default {
  name: 'ChooseAddressView',
  components: { PageScaffold, LoadingBlock, ErrorBlock, EmptyBlock },
  setup() {
    const list = ref([])
    const loading = ref(false)
    const error = ref('')
    const currentId = computed(() => store.state.checkout.addressId)

    async function load() {
      loading.value = true
      error.value = ''
      try {
        if (store.getters['user/isLoggedIn']) {
          list.value = (await accountApi.addresses(store.getters['user/userId'])) || []
        } else if (store.state.location.address) {
          list.value = [store.state.location.address]
        }
      } catch (e) {
        error.value = e.message || '地址加载失败'
      } finally {
        loading.value = false
      }
    }
    onMounted(load)

    function choose(a) {
      store.dispatch('checkout/selectAddress', a.id)
      store.dispatch('location/selectAddress', a)
      router.back()
    }

    return { list, loading, error, currentId, choose }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.choose {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: $space-lg;
  align-items: start;
  padding: $space-lg $content-pad $space-2xl;
}
.choose__state {
  grid-column: 1 / -1;
  padding: $space-xl 0;
}
.choose__add {
  padding: rem(6) $space-md;
  @include sc(14, $color-primary);
  font-weight: 600;
  border-radius: $radius-md;
  transition: background $transition-fast;
  &:hover {
    background: $color-primary-soft;
  }
}
.addr {
  display: flex;
  align-items: center;
  gap: $space-md;
  padding: $card-pad;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  cursor: pointer;
  transition: border-color $transition-fast, box-shadow $transition-fast,
    background $transition-fast;
  &:hover {
    border-color: rgba(255, 83, 57, 0.35);
    box-shadow: $shadow-card-hover;
  }
  &.is-on {
    background: $color-primary-soft;
    border-color: $color-primary;
  }
  &__main {
    flex: 1;
    min-width: 0;
  }
  &__name {
    @include sc(15, $text-title);
    font-weight: 600;
  }
  &__tag {
    display: inline-block;
    margin: 0 $space-sm;
    padding: 0 $space-sm;
    @include sc(12, #fff);
    background: $color-primary;
    border-radius: $radius-sm;
  }
  &__detail {
    margin-top: $space-xs;
    @include sc(13, $text-secondary);
  }
  &__radio {
    @include wh(20, 20);
    flex-shrink: 0;
    border: 2px solid $border-strong;
    border-radius: 50%;
    transition: border-color $transition-fast, background $transition-fast;
    &.is-on {
      border-color: $color-primary;
      background: $color-primary;
      box-shadow: inset 0 0 0 rem(4) #fff;
    }
  }
}
</style>
