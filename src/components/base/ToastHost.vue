<template>
  <transition-group name="toast" tag="div" class="toast-host">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="toast"
      :class="`toast--${t.type}`"
      role="status"
      aria-live="polite"
    >
      {{ t.message }}
    </div>
  </transition-group>
</template>

<script>
import { reactive } from 'vue'

// 模块级单例状态：命令式 API 与组件共享
const state = reactive({ toasts: [] })
let seq = 0

export function toast(message, type = 'info', duration = 2200) {
  const id = ++seq
  state.toasts.push({ id, message, type })
  setTimeout(() => {
    const i = state.toasts.findIndex((t) => t.id === id)
    if (i > -1) state.toasts.splice(i, 1)
  }, duration)
}

export function registerToast(Vue) {
  Vue.prototype.$toast = toast
}

export default {
  name: 'ToastHost',
  computed: {
    toasts() {
      return state.toasts
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/tokens.scss';
@import '../../styles/mixins.scss';

.toast-host {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-sm;
  pointer-events: none;
}

.toast {
  max-width: 480px;
  padding: 10px 20px;
  border-radius: $radius-md;
  background: rgba(23, 26, 33, 0.88);
  color: #fff;
  @include sc(14, #fff);
  text-align: center;
  box-shadow: $shadow-pop;
  backdrop-filter: blur(6px);
  &--success {
    background: rgba(22, 163, 74, 0.94);
  }
  &--error {
    background: rgba(229, 72, 77, 0.94);
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.24s ease;
}
.toast-enter,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
