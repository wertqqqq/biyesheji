<template>
  <page-scaffold title="修改密码">
    <form class="forget" @submit.prevent="submit">
      <label class="field">
        <span class="field__label">账号</span>
        <input v-model="form.username" type="text" placeholder="请输入账号" />
      </label>
      <p v-if="errors.username" class="field__err">{{ errors.username }}</p>

      <label class="field">
        <span class="field__label">新密码</span>
        <input v-model="form.newPassword" type="password" placeholder="至少 6 位" />
      </label>
      <p v-if="errors.newPassword" class="field__err">{{ errors.newPassword }}</p>

      <label class="field">
        <span class="field__label">确认密码</span>
        <input v-model="form.confirm" type="password" placeholder="再次输入新密码" />
      </label>
      <p v-if="errors.confirm" class="field__err">{{ errors.confirm }}</p>

      <div class="field field--captcha">
        <label class="field field--inline">
          <span class="field__label">验证码</span>
          <input v-model="form.captcha" type="text" maxlength="4" placeholder="4 位" />
        </label>
        <button type="button" class="captcha" @click="refresh">{{ captcha || '获取' }}</button>
      </div>

      <div class="forget__submit">
        <app-button type="primary" size="lg" block :loading="submitting" native-type="submit">确认修改</app-button>
      </div>
    </form>
  </page-scaffold>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import router from '@/router'
import { accountApi } from '@/api/modules/account'
import { minLen } from '@/utils/validators'
import PageScaffold from '@/components/base/PageScaffold.vue'
import AppButton from '@/components/base/AppButton.vue'

export default {
  name: 'ForgetView',
  components: { PageScaffold, AppButton },
  setup() {
    const form = reactive({ username: '', newPassword: '', confirm: '', captcha: '' })
    const errors = reactive({})
    const submitting = ref(false)
    const captcha = ref('')

    async function refresh() {
      try {
        const res = await accountApi.captcha()
        captcha.value = res.code
      } catch {
        /* ignore */
      }
    }
    onMounted(refresh)

    function validate() {
      errors.username = form.username.trim() ? '' : '请输入账号'
      errors.newPassword = minLen(form.newPassword, 6) ? '' : '新密码至少 6 位'
      errors.confirm = form.confirm === form.newPassword && form.confirm ? '' : '两次输入的密码不一致'
      return !errors.username && !errors.newPassword && !errors.confirm
    }

    async function submit() {
      if (!validate()) return
      submitting.value = true
      try {
        await accountApi.changePassword({
          username: form.username.trim(),
          oldPassword: '',
          newPassword: form.newPassword,
          confirmPassword: form.confirm,
          captchaCode: form.captcha
        })
        window.alert('密码修改成功，请重新登录')
        router.replace('/login')
      } catch (e) {
        window.alert(e.message || '修改失败')
      } finally {
        submitting.value = false
      }
    }

    return { form, errors, submitting, captcha, refresh, submit }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.forget {
  max-width: 480px;
  margin: 0 auto;
  padding: $space-xl $space-lg $space-2xl;
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
  &--inline {
    flex: 1;
    margin-bottom: 0;
    padding: 0;
    background: none;
    border: none;
    box-shadow: none;
  }
  &--captcha {
    @include flex-between;
  }
  &__label {
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
  &__err {
    margin: rem(-6) 0 $space-md;
    padding-left: $space-lg;
    @include sc(12, $color-danger);
  }
}
.captcha {
  @include wh(120, 44);
  @include flex-center;
  @include sc(15, $color-primary);
  font-weight: 700;
  letter-spacing: 2px;
  background: $color-primary-soft;
  border: 1px solid rgba(255, 83, 57, 0.2);
  border-radius: $radius-md;
  flex-shrink: 0;
  transition: background $transition-fast, color $transition-fast,
    border-color $transition-fast;
  &:hover {
    background: $color-primary-100;
  }
}
.forget__submit {
  margin-top: $space-lg;
}
</style>
