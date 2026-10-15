<template>
  <page-scaffold title="新增地址">
    <form class="add" @submit.prevent="save">
      <button type="button" class="add__pick" @click="$router.push('/checkout/address/new/search')">
        <icon-img name="dingwei" size="md" />
        <span class="add__pick-text ellipsis">{{ form.address || '点击搜索并选择地址' }}</span>
        <span aria-hidden="true">›</span>
      </button>

      <label class="field">
        <span class="field__label">地址</span>
        <input v-model="form.address" type="text" placeholder="小区 / 写字楼 / 学校" />
      </label>

      <label class="field">
        <span class="field__label">门牌号</span>
        <input v-model="form.detail" type="text" placeholder="如：12 楼 1201" />
      </label>

      <label class="field">
        <span class="field__label">联系人</span>
        <input v-model="form.name" type="text" placeholder="收货人姓名" />
      </label>
      <p v-if="errors.name" class="field__err">{{ errors.name }}</p>

      <label class="field">
        <span class="field__label">手机号</span>
        <input v-model="form.phone" type="tel" maxlength="11" placeholder="11 位手机号" />
      </label>
      <p v-if="errors.phone" class="field__err">{{ errors.phone }}</p>

      <div class="add__submit">
        <app-button type="primary" size="lg" block :loading="submitting" native-type="submit">保存并使用</app-button>
      </div>
    </form>
  </page-scaffold>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import router from '@/router'
import store from '@/stores'
import { accountApi } from '@/api/modules/account'
import { isPhone } from '@/utils/validators'
import PageScaffold from '@/components/base/PageScaffold.vue'
import AppButton from '@/components/base/AppButton.vue'
import IconImg from '@/components/base/IconImg.vue'

export default {
  name: 'AddAddressView',
  components: { PageScaffold, AppButton, IconImg },
  setup() {
    const submitting = ref(false)
    const errors = reactive({})
    const form = reactive({
      name: '',
      phone: '',
      address: '',
      detail: '',
      geohash: store.getters['location/geohash']
    })

    onMounted(() => {
      const picked = store.state.checkout.pickedPlace
      if (picked) {
        form.address = picked.name
        form.geohash = picked.geohash || form.geohash
      }
    })

    function validate() {
      errors.name = form.name.trim() ? '' : '请填写联系人'
      errors.phone = isPhone(form.phone) ? '' : '请输入正确的手机号'
      return !errors.name && !errors.phone
    }

    async function save() {
      if (!form.address.trim()) {
        window.alert('请先选择地址')
        return
      }
      if (!validate()) return
      submitting.value = true
      try {
        const userId = store.getters['user/userId']
        const created = await accountApi.addAddress(userId, {
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          detail: form.detail.trim(),
          geohash: form.geohash
        })
        store.dispatch('checkout/setPickedPlace', null)
        if (created && created.id) {
          store.dispatch('checkout/selectAddress', created.id)
          store.dispatch('location/selectAddress', created)
        }
        router.replace('/checkout')
      } catch (e) {
        window.alert(e.message || '保存失败')
      } finally {
        submitting.value = false
      }
    }

    return { form, errors, submitting, save }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.add {
  max-width: rem(520);
  margin: 0 auto;
  padding: $space-xl $content-pad $space-2xl;
}
.add__pick {
  @include flex-between;
  width: 100%;
  margin-bottom: $space-md;
  gap: $space-sm;
  padding: $card-pad;
  background: $color-primary-soft;
  border: 1px solid $color-primary;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  @include sc(14, $color-primary-600);
  transition: background $transition-fast;
  &:hover {
    background: $color-primary-100;
  }
  &-text {
    flex: 1;
    text-align: left;
    font-weight: 600;
  }
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
  &__err {
    margin: rem(-6) 0 $space-md;
    @include sc(13, $color-danger);
  }
}
.add__submit {
  margin-top: $space-lg;
}
</style>
