<template>
  <page-scaffold title="修改用户名">
    <div class="setname">
      <label class="field">
        <span class="field__label">用户名</span>
        <input v-model="name" type="text" maxlength="20" placeholder="请输入新用户名" />
      </label>
      <p class="setname__tip">用户名将展示在订单与评价中，支持中英文、数字。</p>
      <div class="setname__submit">
        <app-button type="primary" size="lg" block :loading="submitting" @click="save">保存</app-button>
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
  name: 'SetUsernameView',
  components: { PageScaffold, AppButton },
  setup() {
    const name = ref(store.getters['user/displayName'] === '未登录' ? '' : store.getters['user/displayName'])
    const submitting = ref(false)

    function save() {
      const val = name.value.trim()
      if (!val) {
        window.alert('请输入用户名')
        return
      }
      submitting.value = true
      try {
        const user = { ...(store.state.user.userInfo || {}), username: val }
        store.commit('user/SET_USER', user)
        router.back()
      } finally {
        submitting.value = false
      }
    }

    return { name, submitting, save }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.setname {
  max-width: rem(520);
  margin: 0 auto;
  padding: $space-xl $content-pad $space-2xl;
}
.field {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
  margin-bottom: $space-md;
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
  &__label {
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
.setname__tip {
  margin-top: $space-md;
  @include sc(13, $text-secondary);
}
.setname__submit {
  margin-top: $space-xl;
}
</style>
