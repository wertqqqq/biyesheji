<template>
  <div
    class="auth-field"
    :class="{
      'is-focused': focused,
      'is-filled': !!value,
      'has-error': !!error,
      'is-disabled': disabled
    }"
  >
    <span v-if="$slots.icon" class="auth-field__icon" aria-hidden="true">
      <slot name="icon" />
    </span>

    <div class="auth-field__control">
      <input
        :id="uid"
        ref="input"
        class="auth-field__input"
        :type="type"
        :value="value"
        :placeholder="placeholder || ' '"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :disabled="disabled"
        @input="$emit('input', $event.target.value)"
        @focus="onFocus"
        @blur="onBlur"
        @keyup.enter="$emit('enter')"
      />
      <label :for="uid" class="auth-field__label">{{ label }}</label>
      <span class="auth-field__bar" aria-hidden="true" />
    </div>

    <span v-if="$slots.trailing" class="auth-field__trailing">
      <slot name="trailing" />
    </span>

    <transition name="field-err">
      <p v-if="error" class="auth-field__error" role="alert">{{ error }}</p>
    </transition>
  </div>
</template>

<script>
let seq = 0
export default {
  name: 'AuthField',
  props: {
    label: { type: String, required: true },
    value: { type: [String, Number], default: '' },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    error: { type: String, default: '' },
    maxlength: { type: [String, Number], default: null },
    autocomplete: { type: String, default: 'off' },
    inputmode: { type: String, default: null },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return { focused: false, uid: `af-${++seq}` }
  },
  methods: {
    onFocus(e) {
      this.focused = true
      this.$emit('focus', e)
    },
    onBlur(e) {
      this.focused = false
      this.$emit('blur', e)
    },
    focus() {
      this.$refs.input && this.$refs.input.focus()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.auth-field {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  height: 56px;
  background: $bg-card;
  border: 1.5px solid $border-color;
  border-radius: $radius-lg;
  transition: border-color $transition, box-shadow $transition, background $transition;

  &:hover {
    border-color: $border-strong;
  }
  &:focus-within {
    border-color: $color-primary;
    box-shadow: 0 0 0 4px rgba(255, 83, 57, 0.14);
  }
  &.has-error {
    border-color: $color-danger;
    &:focus-within {
      box-shadow: 0 0 0 4px rgba(229, 72, 77, 0.14);
    }
  }
  &.is-disabled {
    opacity: 0.55;
    background: $bg-page;
  }

  &__icon {
    @include flex-center;
    @include wh(22, 22);
    @include sc(18, $text-secondary);
    flex-shrink: 0;
    transition: color $transition;
  }
  &:focus-within &__icon {
    color: $color-primary;
  }

  &__control {
    position: relative;
    flex: 1;
    min-width: 0;
    height: 100%;
    display: flex;
    align-items: center;
  }

  &__input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    @include sc(15, $text-title);
    font-family: inherit;
    &::placeholder {
      color: transparent;
    }
    &:disabled {
      cursor: not-allowed;
    }
  }

  &__label {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    @include sc(15, $text-secondary);
    pointer-events: none;
    transform-origin: left center;
    transition: transform $transition, color $transition;
  }
  // 浮动到上方（聚焦或已填写）
  &__input:focus ~ &__label,
  &__input:not(:placeholder-shown) ~ &__label {
    transform: translateY(-22px) scale(0.82);
  }
  &:focus-within &__label {
    color: $color-primary;
  }
  &.has-error:not(:focus-within) &__label {
    color: $color-danger;
  }

  // 聚焦时底部滑入的高亮条
  &__bar {
    position: absolute;
    left: 0;
    bottom: 6px;
    height: 2px;
    width: 100%;
    background: $color-primary;
    border-radius: $radius-pill;
    transform: scaleX(0);
    transform-origin: center;
    opacity: 0;
    transition: transform $transition, opacity $transition;
  }
  &:focus-within &__bar {
    transform: scaleX(1);
    opacity: 1;
  }

  &__trailing {
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  &__error {
    position: absolute;
    left: 2px;
    bottom: -20px;
    @include sc(12, $color-danger);
  }
}

.field-err-enter-active,
.field-err-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.field-err-enter,
.field-err-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
