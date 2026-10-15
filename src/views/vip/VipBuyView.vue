<template>
  <page-scaffold title="购买会员卡">
    <div class="vip-buy">
      <div v-if="loading" class="state"><loading-block text="加载中…" /></div>
      <template v-else>
        <h3 class="vip-buy__label">选择套餐</h3>
        <div class="vip-buy__plans">
          <button
            v-for="p in plans"
            :key="p.id"
            type="button"
            class="plan"
            :class="{ 'is-on': selected === p.id }"
            @click="selected = p.id"
          >
            <p class="plan__name">{{ p.name }}</p>
            <p class="plan__price">¥{{ p.price }}<s>¥{{ p.originPrice }}</s></p>
          </button>
        </div>

        <h3 class="vip-buy__label">兑换实体卡（选填）</h3>
        <label class="field">
          <span>卡号</span>
          <input v-model="card.number" type="text" placeholder="会员卡卡号" />
        </label>
        <label class="field">
          <span>密码</span>
          <input v-model="card.password" type="password" placeholder="卡密" />
        </label>

        <div class="vip-buy__submit">
          <app-button type="primary" size="lg" block :loading="submitting" @click="submit">立即支付开通</app-button>
        </div>
        <p class="vip-buy__note">演示环境，不会产生真实扣款。</p>
      </template>
    </div>
  </page-scaffold>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import router from '@/router'
import store from '@/stores'
import { contentApi } from '@/api/modules/content'
import PageScaffold from '@/components/base/PageScaffold.vue'
import AppButton from '@/components/base/AppButton.vue'
import LoadingBlock from '@/components/base/LoadingBlock.vue'

export default {
  name: 'VipBuyView',
  components: { PageScaffold, AppButton, LoadingBlock },
  setup() {
    const plans = ref([])
    const selected = ref('')
    const submitting = ref(false)
    const loading = ref(true)
    const card = reactive({ number: '', password: '' })

    onMounted(async () => {
      try {
        const data = await contentApi.vipDescription()
        plans.value = data.plans || []
        if (plans.value.length) selected.value = plans.value[0].id
      } catch {
        /* ignore */
      } finally {
        loading.value = false
      }
    })

    async function submit() {
      if (!store.getters['user/isLoggedIn']) {
        router.push('/login')
        return
      }
      submitting.value = true
      try {
        if (card.number && card.password) {
          await contentApi.bindVip(store.getters['user/userId'], card.number, card.password)
        }
        window.alert('会员开通成功（演示）')
        router.back()
      } catch (e) {
        window.alert(e.message || '开通失败')
      } finally {
        submitting.value = false
      }
    }

    return { plans, selected, submitting, loading, card, submit }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.vip-buy {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 $content-pad $space-2xl;
}
.state {
  padding-top: rem(80);
}
.vip-buy__label {
  @include sc(16, $text-title);
  font-weight: 600;
  margin: $space-lg 0 $space-md;
}
.vip-buy__plans {
  display: flex;
  gap: $space-md;
  margin-bottom: $space-lg;
}
.plan {
  flex: 1;
  padding: $space-lg;
  text-align: center;
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
  &.is-on {
    border-color: $color-primary;
    box-shadow: 0 0 0 1px $color-primary;
  }
  &__name {
    @include sc(14, $text-body);
  }
  &__price {
    margin-top: $space-sm;
    @include sc(22, $color-primary);
    font-weight: 800;
    s {
      margin-left: $space-xs;
      @include sc(12, $text-placeholder);
      font-weight: 400;
    }
  }
}
.field {
  display: flex;
  align-items: center;
  gap: $space-md;
  margin-bottom: $space-md;
  padding: 10px 14px;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  transition: border-color $transition-fast, box-shadow $transition-fast;
  &:focus-within {
    border-color: $color-primary;
    box-shadow: 0 0 0 3px rgba(255, 83, 57, 0.12);
  }
  span {
    @include sc(13, $text-body);
    white-space: nowrap;
  }
  input {
    flex: 1;
    @include sc(14, $text-title);
    &::placeholder {
      color: $text-placeholder;
    }
  }
}
.vip-buy__submit {
  margin-top: $space-lg;
}
.vip-buy__note {
  margin-top: $space-md;
  text-align: center;
  @include sc(12, $text-placeholder);
}
</style>
