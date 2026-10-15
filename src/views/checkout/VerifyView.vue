<template>
  <page-scaffold title="身份验证">
    <div class="verify">
      <div class="verify__icon">🔒</div>
      <p class="verify__desc">为保障账户与资金安全，本次下单需要短信验证</p>

      <label class="verify__field">
        <span>验证码</span>
        <input v-model="code" type="text" maxlength="6" placeholder="6 位短信验证码" />
      </label>
      <p v-if="tip" class="verify__tip">模拟验证码：{{ tip }}</p>

      <app-button type="primary" size="lg" block :loading="submitting" @click="submit">验证并下单</app-button>
      <button type="button" class="verify__resend" :disabled="counting > 0" @click="resend">
        {{ counting > 0 ? `${counting}s 后重发` : '收不到验证码？重新发送' }}
      </button>
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
  name: 'VerifyView',
  components: { PageScaffold, AppButton },
  setup() {
    const code = ref('')
    const tip = ref('')
    const submitting = ref(false)
    const counting = ref(0)

    onMounted(() => {
      tip.value = '1234'
    })

    async function resend() {
      try {
        const res = await orderApi.resendVerify(store.state.checkout.cartId || 'x', store.state.checkout.sig || 'y')
        tip.value = (res && res.mockCode) || '1234'
        counting.value = 60
        const t = setInterval(() => {
          counting.value -= 1
          if (counting.value <= 0) clearInterval(t)
        }, 1000)
      } catch {
        /* ignore */
      }
    }

    async function submit() {
      if (code.value.trim().length < 4) return
      submitting.value = true
      try {
        if (code.value.trim() === '1234') {
          router.replace('/orders')
        } else {
          window.alert('验证码错误，请重新输入')
        }
      } finally {
        submitting.value = false
      }
    }

    return { code, tip, submitting, counting, resend, submit }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.verify {
  max-width: rem(520);
  margin: 0 auto;
  padding: $space-xl $content-pad $space-2xl;
  text-align: center;
}
.verify__icon {
  @include sc(48, $text-title);
  margin-bottom: $space-md;
}
.verify__desc {
  @include sc(14, $text-secondary);
  margin-bottom: $space-xl;
}
.verify__field {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
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
    text-align: center;
    letter-spacing: 2px;
    background: $bg-card;
    border: 1px solid $border-color;
    border-radius: $radius-md;
    transition: border-color $transition-fast, box-shadow $transition-fast;
    &::placeholder {
      color: $text-placeholder;
      letter-spacing: 0;
    }
    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba(255, 83, 57, 0.12);
    }
  }
}
.verify__tip {
  margin: $space-md 0 $space-lg;
  @include sc(13, $color-success);
}
.verify__resend {
  margin-top: $space-lg;
  @include sc(14, $color-primary);
  transition: color $transition-fast;
  &:hover:not(:disabled) {
    color: $color-primary-600;
  }
  &:disabled {
    color: $text-placeholder;
    cursor: not-allowed;
  }
}
</style>
