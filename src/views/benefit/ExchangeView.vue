<template>
  <page-scaffold title="兑换红包">
    <div class="exchange">
      <div class="exchange__banner">🧧</div>
      <p class="exchange__desc">输入兑换码，领取专属红包</p>

      <label class="field">
        <span class="field__label">兑换码</span>
        <input v-model="code" type="text" placeholder="请输入兑换码" />
      </label>

      <div class="field field--captcha">
        <label class="field field--inline">
          <span class="field__label">验证码</span>
          <input v-model="captcha" type="text" maxlength="4" placeholder="4 位" />
        </label>
        <button type="button" class="captcha" @click="refresh">{{ capText }}</button>
      </div>

      <div class="exchange__submit">
        <app-button type="primary" size="lg" block :loading="submitting" @click="submit">立即兑换</app-button>
      </div>
      <p class="exchange__tip">兑换码区分大小写，请从官方活动渠道获取。</p>
    </div>
  </page-scaffold>
</template>

<script>
import { onMounted, ref } from 'vue'
import store from '@/stores'
import { accountApi } from '@/api/modules/account'
import { contentApi } from '@/api/modules/content'
import PageScaffold from '@/components/base/PageScaffold.vue'
import AppButton from '@/components/base/AppButton.vue'

export default {
  name: 'ExchangeView',
  components: { PageScaffold, AppButton },
  setup() {
    const code = ref('')
    const captcha = ref('')
    const capText = ref('获取')
    const submitting = ref(false)

    async function refresh() {
      try {
        const res = await accountApi.captcha()
        capText.value = res.code
      } catch {
        /* ignore */
      }
    }
    onMounted(refresh)

    async function submit() {
      if (!code.value.trim()) {
        window.alert('请输入兑换码')
        return
      }
      submitting.value = true
      try {
        await contentApi.exchangeHongbao(store.getters['user/userId'], code.value.trim(), captcha.value)
        window.alert('兑换成功，红包已到账')
        code.value = ''
      } catch (e) {
        window.alert(e.message || '兑换失败')
      } finally {
        submitting.value = false
      }
    }

    return { code, captcha, capText, submitting, refresh, submit }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.exchange {
  max-width: 480px;
  margin: 0 auto;
  padding: $content-pad;
  padding-bottom: $space-2xl;
  text-align: center;
  &__banner {
    @include sc(48, $text-title);
    margin-bottom: $space-md;
  }
  &__desc {
    @include sc(14, $text-secondary);
    margin-bottom: $space-xl;
  }
}
.field {
  display: flex;
  align-items: center;
  gap: $space-md;
  margin-bottom: $space-md;
  padding: $space-sm $space-md;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  text-align: left;
  transition: border-color $transition-fast, box-shadow $transition-fast;
  &:focus-within {
    border-color: $color-primary;
    box-shadow: 0 0 0 3px rgba(255, 83, 57, 0.12);
  }
  &--inline {
    flex: 1;
    margin-bottom: 0;
    padding: 0;
    background: none;
    border: none;
    box-shadow: none;
    &:focus-within {
      border: none;
      box-shadow: none;
    }
  }
  &--captcha {
    @include flex-between;
  }
  &__label {
    @include sc(14, $text-body);
    white-space: nowrap;
  }
  input {
    flex: 1;
    min-width: 0;
    @include sc(14, $text-title);
    &::placeholder {
      color: $text-placeholder;
    }
  }
}
.captcha {
  @include wh(120, 38);
  @include flex-center;
  @include sc(16, $color-primary);
  font-weight: 700;
  letter-spacing: 2px;
  background: $color-primary-100;
  border-radius: $radius-md;
  flex-shrink: 0;
  transition: background-color $transition-fast, color $transition-fast;
  &:hover {
    background: $color-primary;
    color: #fff;
  }
}
.exchange__submit {
  margin-top: $space-lg;
}
.exchange__tip {
  margin-top: $space-md;
  @include sc(12, $text-placeholder);
}
</style>
