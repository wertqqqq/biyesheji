<template>
  <page-scaffold title="订单备注">
    <div class="remark">
      <h3 class="remark__label">快捷备注</h3>
      <div class="remark__quick">
        <button
          v-for="r in remarks"
          :key="r"
          type="button"
          class="remark__chip"
          :class="{ 'is-on': custom === r }"
          @click="custom = r"
        >
          {{ r }}
        </button>
      </div>

      <h3 class="remark__label">其他要求</h3>
      <div class="remark__custom">
        <textarea v-model="custom" maxlength="100" placeholder="口味、忌口等特殊要求（选填）" />
        <span class="remark__count">{{ custom.length }}/100</span>
      </div>

      <div class="remark__submit">
        <app-button type="primary" size="lg" block @click="save">确定</app-button>
      </div>
    </div>
  </page-scaffold>
</template>

<script>
import { onMounted, ref } from 'vue'
import router from '@/router'
import store from '@/stores'
import { orderApi } from '@/api/modules/order'
import PageScaffold from '@/components/base/PageScaffold.vue'
import AppButton from '@/components/base/AppButton.vue'

export default {
  name: 'RemarkView',
  components: { PageScaffold, AppButton },
  setup() {
    const remarks = ref([])
    const custom = ref(store.state.checkout.remark || '')

    onMounted(async () => {
      try {
        const { cartId, sig } = store.state.checkout
        remarks.value = (await orderApi.remarks(cartId || 'x', sig || 'y')) || []
      } catch {
        remarks.value = ['不要辣', '少辣', '多饭', '少饭', '加辣', '不要葱', '打包']
      }
    })

    function save() {
      store.dispatch('checkout/setRemark', custom.value.trim())
      router.back()
    }

    return { remarks, custom, save }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.remark {
  max-width: rem(520);
  margin: 0 auto;
  padding: $space-xl $content-pad $space-2xl;
}
.remark__label {
  @include sc(15, $text-title);
  margin: $space-md 0;
}
.remark__quick {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
}
.remark__chip {
  padding: rem(8) rem(16);
  @include sc(13, $text-body);
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-pill;
  transition: background $transition-fast, color $transition-fast,
    border-color $transition-fast;
  &:hover {
    background: $bg-hover;
    border-color: $border-strong;
  }
  &.is-on {
    color: $color-primary;
    background: $color-primary-soft;
    border-color: $color-primary;
    font-weight: 600;
    &:hover {
      background: $color-primary-100;
    }
  }
}
.remark__custom {
  position: relative;
  padding: $card-pad;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  textarea {
    width: 100%;
    min-height: rem(120);
    @include sc(14, $text-body);
    resize: none;
    line-height: 1.6;
    &::placeholder {
      color: $text-placeholder;
    }
  }
}
.remark__count {
  position: absolute;
  right: $card-pad;
  bottom: $space-md;
  @include sc(12, $text-secondary);
}
.remark__submit {
  margin-top: $space-xl;
}
</style>
