<template>
  <div class="addr-edit">
    <header class="addr-edit__bar">
      <button type="button" class="addr-edit__back" aria-label="返回" @click="back">
        <svg viewBox="0 0 24 24" width="60%" height="60%"><path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <span>{{ isEdit ? '编辑地址' : '新增地址' }}</span>
    </header>

    <form class="addr-edit__form" @submit.prevent="save">
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

      <div class="field field--tags">
        <span class="field__label">标签</span>
        <div class="chips">
          <button v-for="t in tags" :key="t" type="button" class="chip" :class="{ 'is-on': form.tag === t }" @click="form.tag = t">{{ t }}</button>
        </div>
      </div>

      <label class="field">
        <span class="field__label">地址</span>
        <input v-model="form.address" type="text" placeholder="如：徐家汇 · 汇金百货" />
      </label>
      <p v-if="errors.address" class="field__err">{{ errors.address }}</p>

      <label class="field">
        <span class="field__label">门牌号</span>
        <input v-model="form.detail" type="text" placeholder="如：12 楼 1201（选填）" />
      </label>

      <div class="addr-edit__submit">
        <app-button type="primary" size="lg" block :loading="submitting" native-type="submit">保存地址</app-button>
      </div>
    </form>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import router from '@/router'
import store from '@/stores'
import { accountApi } from '@/api/modules/account'
import { isPhone } from '@/utils/validators'
import AppButton from '@/components/base/AppButton.vue'

export default {
  name: 'AddressEditView',
  components: { AppButton },
  setup() {
    const id = router.currentRoute.params.id
    const isEdit = !!id
    const tags = ['家', '公司', '学校', '其他']
    const submitting = ref(false)
    const errors = reactive({})
    const form = reactive({
      name: '',
      phone: '',
      tag: '家',
      address: '',
      detail: '',
      geohash: store.getters['location/geohash']
    })

    onMounted(async () => {
      if (!isEdit) return
      try {
        const list = (await accountApi.addresses(store.getters['user/userId'])) || []
        const found = list.find((a) => a.id === id)
        if (found) Object.assign(form, found)
      } catch (e) {
        window.alert(e.message || '地址加载失败')
      }
    })

    function validate() {
      errors.name = form.name.trim() ? '' : '请填写联系人'
      errors.phone = isPhone(form.phone) ? '' : '请输入正确的手机号'
      errors.address = form.address.trim() ? '' : '请填写地址'
      return !errors.name && !errors.phone && !errors.address
    }

    async function save() {
      if (!validate()) return
      submitting.value = true
      try {
        const userId = store.getters['user/userId']
        const payload = {
          name: form.name.trim(),
          phone: form.phone.trim(),
          tag: form.tag,
          address: form.address.trim(),
          detail: form.detail.trim(),
          geohash: form.geohash
        }
        if (isEdit) await accountApi.updateAddress(userId, id, payload)
        else await accountApi.addAddress(userId, payload)
        router.back()
      } catch (e) {
        window.alert(e.message || '保存失败')
      } finally {
        submitting.value = false
      }
    }

    function back() {
      router.back()
    }

    return { isEdit, tags, form, errors, submitting, save, back }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.addr-edit {
  min-height: 100%;
  background: $bg-page;
}
.addr-edit__bar {
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
}
.addr-edit__back {
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

.addr-edit__form {
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
  &--tags {
    flex-direction: row;
    align-items: center;
    @include flex-between;
  }
  &__err {
    margin: rem(-6) 0 $space-md;
    @include sc(13, $color-danger);
  }
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
}
.chip {
  padding: rem(8) rem(16);
  @include sc(13, $text-body);
  background: $bg-page;
  border: 1px solid transparent;
  border-radius: $radius-pill;
  transition: background $transition-fast, color $transition-fast,
    border-color $transition-fast;
  &:hover {
    background: $bg-active;
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
.addr-edit__submit {
  margin-top: $space-lg;
}
</style>
