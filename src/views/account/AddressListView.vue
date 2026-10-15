<template>
  <div class="addr-list">
    <header class="addr-list__bar">
      <button type="button" class="addr-list__back" aria-label="返回" @click="back">
        <svg viewBox="0 0 24 24" width="60%" height="60%"><path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <span>收货地址</span>
      <button type="button" class="addr-list__add" @click="$router.push('/account/addresses/new')">＋ 新增</button>
    </header>

    <div v-if="!isLoggedIn" class="addr-list__guest">
      <empty-block icon="🔐" text="登录后管理地址">
        <app-button type="primary" size="sm" @click="$router.push('/login')">去登录</app-button>
      </empty-block>
    </div>

    <div v-else class="addr-list__body">
      <div v-if="loading" class="addr-list__state"><loading-block /></div>
      <error-block v-else-if="error" :text="error" @retry="load" />
      <empty-block v-else-if="!list.length" icon="shouhuodizhiyebianji" text="还没有收货地址" subtext="点击右上角新增一个吧" />

      <article v-for="a in list" :key="a.id" class="addr" @click="edit(a)">
        <div class="addr__main">
          <p class="addr__name">
            {{ a.name }}
            <span v-if="a.tag" class="addr__tag">{{ a.tag }}</span>
            {{ a.phone }}
          </p>
          <p class="addr__detail ellipsis-2">{{ a.address }} {{ a.detail }}</p>
        </div>
        <div class="addr__ops" @click.stop>
          <button type="button" class="addr__op" @click="edit(a)">编辑</button>
          <button type="button" class="addr__op addr__op--danger" @click="remove(a)">删除</button>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import router from '@/router'
import store from '@/stores'
import { accountApi } from '@/api/modules/account'
import AppButton from '@/components/base/AppButton.vue'
import LoadingBlock from '@/components/base/LoadingBlock.vue'
import ErrorBlock from '@/components/base/ErrorBlock.vue'
import EmptyBlock from '@/components/base/EmptyBlock.vue'

export default {
  name: 'AddressListView',
  components: { AppButton, LoadingBlock, ErrorBlock, EmptyBlock },
  setup() {
    const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])
    const list = ref([])
    const loading = ref(false)
    const error = ref('')

    async function load() {
      loading.value = true
      error.value = ''
      try {
        list.value = (await accountApi.addresses(store.getters['user/userId'])) || []
      } catch (e) {
        error.value = e.message || '地址加载失败'
      } finally {
        loading.value = false
      }
    }
    onMounted(() => {
      if (isLoggedIn.value) load()
    })

    function edit(a) {
      router.push(`/account/addresses/${a.id}`)
    }
    async function remove(a) {
      if (!window.confirm(`确定删除「${a.address}」这条地址吗？`)) return
      try {
        await accountApi.deleteAddress(store.getters['user/userId'], a.id)
        list.value = list.value.filter((x) => x.id !== a.id)
        if (store.state.location.address && store.state.location.address.id === a.id) {
          store.dispatch('location/selectAddress', null)
        }
      } catch (e) {
        window.alert(e.message || '删除失败')
      }
    }
    function back() {
      if (window.history.length > 1) router.back()
      else router.replace('/account')
    }

    return { isLoggedIn, list, loading, error, load, edit, remove, back }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.addr-list {
  min-height: 100%;
  background: $bg-page;
}
.addr-list__bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: $space-md;
  @include wh(100%, $page-head-h);
  padding: 0 $content-pad;
  @include sc(17, $text-title);
  font-weight: 600;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid $border-color;
  span {
    flex: 1;
  }
}
.addr-list__back {
  @include wh(34, 34);
  @include flex-center;
  flex-shrink: 0;
  color: $text-body;
  border-radius: $radius-md;
  transition: background $transition-fast, color $transition-fast;
  &:hover {
    background: $bg-hover;
    color: $text-title;
  }
}
.addr-list__add {
  padding: rem(6) $space-md;
  @include sc(14, $color-primary);
  font-weight: 600;
  border-radius: $radius-md;
  transition: background $transition-fast;
  &:hover {
    background: $color-primary-soft;
  }
}
.addr-list__guest {
  padding: rem(96) 0;
}
.addr-list__body {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: $space-lg;
  align-items: start;
  padding: $space-lg $content-pad $space-2xl;
}
.addr-list__state {
  grid-column: 1 / -1;
  padding: $space-xl 0;
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
  transition: border-color $transition-fast, box-shadow $transition-fast;
  &:hover {
    border-color: rgba(255, 83, 57, 0.35);
    box-shadow: $shadow-card-hover;
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
  &__ops {
    display: flex;
    flex-direction: row;
    gap: $space-sm;
    flex-shrink: 0;
  }
  &__op {
    padding: rem(6) rem(14);
    @include sc(13, $color-primary);
    border: 1px solid $color-primary;
    border-radius: $radius-pill;
    transition: background $transition-fast, color $transition-fast;
    &:hover {
      background: $color-primary;
      color: #fff;
    }
    &--danger {
      color: $color-danger;
      border-color: $color-danger;
      &:hover {
        background: $color-danger;
        color: #fff;
      }
    }
  }
}
</style>
