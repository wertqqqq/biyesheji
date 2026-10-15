<template>
  <button
    class="submit-btn"
    :class="[`is-${state}`, { 'is-block': block }]"
    :disabled="state === 'loading' || state === 'success'"
    :aria-busy="state === 'loading'"
    @click="$emit('click', $event)"
  >
    <span class="submit-btn__content">
      <span v-if="state === 'loading'" class="submit-btn__spinner" aria-hidden="true" />
      <svg v-else-if="state === 'success'" class="submit-btn__check" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span class="submit-btn__text">{{ displayText }}</span>
    </span>
  </button>
</template>

<script>
export default {
  name: 'SubmitButton',
  props: {
    state: { type: String, default: 'idle' }, // idle | loading | success | error
    text: { type: String, default: '提交' },
    successText: { type: String, default: '成功' },
    block: { type: Boolean, default: true }
  },
  computed: {
    displayText() {
      if (this.state === 'loading') return '处理中…'
      if (this.state === 'success') return this.successText
      return this.text
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.submit-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 52px;
  margin-top: 6px;
  border-radius: $radius-lg;
  border: none;
  cursor: pointer;
  overflow: hidden;
  color: #fff;
  font-weight: 700;
  letter-spacing: 1px;
  background: linear-gradient(135deg, $color-primary, $color-primary-600);
  box-shadow: 0 6px 16px rgba(255, 83, 57, 0.32);
  transition: transform $transition, box-shadow $transition, filter $transition, background $transition;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -60%;
    width: 40%;
    height: 100%;
    background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transform: skewX(-20deg);
    transition: left 0.6s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(255, 83, 57, 0.42);
    &::after { left: 120%; }
  }
  &:active:not(:disabled) {
    transform: translateY(0);
    filter: brightness(0.96);
  }
  &:disabled { cursor: default; }

  &.is-loading {
    background: linear-gradient(135deg, $color-primary, $color-primary-600);
  }
  &.is-success {
    background: linear-gradient(135deg, #1bb35a, $color-success);
    box-shadow: 0 8px 20px rgba(22, 163, 74, 0.38);
  }
  &.is-error {
    background: linear-gradient(135deg, #ef4444, $color-danger);
    box-shadow: 0 8px 20px rgba(229, 72, 77, 0.4);
    animation: btn-shake 0.5s cubic-bezier(.36,.07,.19,.97);
  }
}

.submit-btn__content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.submit-btn__text { @include sc(16, #fff); }
.submit-btn__spinner {
  @include wh(20, 20);
  border: 2.5px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: btn-spin 0.7s linear infinite;
}
.submit-btn__check {
  width: 24px;
  height: 24px;
  path {
    stroke-dasharray: 26;
    stroke-dashoffset: 26;
    animation: draw 0.35s ease 0.05s forwards;
  }
}

@keyframes btn-spin { to { transform: rotate(360deg); } }
@keyframes btn-shake {
  10%, 90% { transform: translateX(-2px); }
  20%, 80% { transform: translateX(4px); }
  30%, 50%, 70% { transform: translateX(-6px); }
  40%, 60% { transform: translateX(6px); }
}
@keyframes draw { to { stroke-dashoffset: 0; } }

@media (prefers-reduced-motion: reduce) {
  .submit-btn::after { display: none; }
  .submit-btn.is-error { animation: none; }
  .submit-btn__check path { animation: none; stroke-dashoffset: 0; }
}
</style>
