<template>
  <page-scaffold title="发票抬头">
    <div class="invoice">
      <div class="invoice__switch">
        <span>需要开发票</span>
        <button
          type="button"
          class="switch"
          :class="{ 'is-on': need }"
          role="switch"
          :aria-checked="need"
          @click="need = !need"
        >
          <span class="switch__knob" />
        </button>
      </div>

      <template v-if="need">
        <h3 class="invoice__label">抬头类型</h3>
        <div class="invoice__types">
          <button
            v-for="t in types"
            :key="t"
            type="button"
            class="invoice__type"
            :class="{ 'is-on': titleType === t }"
            @click="titleType = t"
          >
            {{ t }}
          </button>
        </div>

        <label class="invoice__field">
          <span>抬头名称</span>
          <input v-model="title" type="text" placeholder="请输入发票抬头" />
        </label>
        <p class="invoice__tip">发票将在订单完成后发送至预留邮箱或可自行下载。</p>
      </template>

      <div class="invoice__submit">
        <app-button type="primary" size="lg" block @click="save">确定</app-button>
      </div>
    </div>
  </page-scaffold>
</template>

<script>
import { ref } from 'vue'
import router from '@/router'
import store from '@/stores'
import PageScaffold from '@/components/base/PageScaffold.vue'
import AppButton from '@/components/base/AppButton.vue'

export default {
  name: 'InvoiceView',
  components: { PageScaffold, AppButton },
  setup() {
    const { invoice, invoiceTitle } = store.state.checkout
    const need = ref(invoice)
    const types = ['个人', '公司']
    const titleType = ref(invoiceTitle && !['个人', '公司'].includes(invoiceTitle) ? '公司' : invoiceTitle || '个人')
    const title = ref(invoiceTitle || '个人')

    function save() {
      store.dispatch('checkout/setInvoice', {
        invoice: need.value,
        title: need.value ? (title.value.trim() || titleType.value) : ''
      })
      router.back()
    }

    return { need, types, titleType, title, save }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.invoice {
  max-width: rem(520);
  margin: 0 auto;
  padding: $space-xl $content-pad $space-2xl;
}
.invoice__switch {
  @include flex-between;
  padding: $card-pad;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  @include sc(14, $text-body);
}
.switch {
  position: relative;
  @include wh(46, 26);
  flex-shrink: 0;
  background: $border-strong;
  border-radius: $radius-pill;
  transition: background 0.2s ease;
  &:hover {
    background: $text-placeholder;
  }
  &.is-on {
    background: $color-primary;
    &:hover {
      background: $color-primary-600;
    }
  }
  &__knob {
    position: absolute;
    top: rem(3);
    left: rem(3);
    @include wh(20, 20);
    background: #fff;
    border-radius: 50%;
    transition: transform 0.2s ease;
  }
  &.is-on &__knob {
    transform: translateX(rem(20));
  }
}
.invoice__label {
  @include sc(15, $text-title);
  margin: $space-lg 0 $space-md;
}
.invoice__types {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
}
.invoice__type {
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
.invoice__field {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
  margin-top: $space-lg;
  padding: $card-pad;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  transition: border-color $transition-fast, box-shadow $transition-fast;
  &:focus-within {
    border-color: $color-primary;
    box-shadow: 0 0 0 3px rgba(255, 83, 57, 0.12);
  }
  span {
    @include sc(13, $text-body);
  }
  input {
    width: 100%;
    padding: 10px 14px;
    @include sc(14, $text-title);
    background: $bg-card;
    border: 1px solid $border-color;
    border-radius: $radius-md;
    transition: border-color $transition-fast, box-shadow $transition-fast;
    &::placeholder {
      color: $text-placeholder;
    }
    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba(255, 83, 57, 0.12);
    }
  }
}
.invoice__tip {
  margin-top: $space-md;
  @include sc(13, $text-secondary);
}
.invoice__submit {
  margin-top: $space-xl;
}
</style>
