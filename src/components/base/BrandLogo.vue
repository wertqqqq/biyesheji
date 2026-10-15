<template>
  <span class="brand-logo" :class="`brand-logo--${variant}`">
    <span class="brand-logo__mark" :class="{ 'brand-logo__mark--animated': animated }" aria-hidden="true">
      <svg viewBox="0 0 48 48" class="brand-logo__svg">
        <!-- 蒸汽：三缕上升曲线 -->
        <g class="brand-logo__steam" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round">
          <path d="M18 18c-2.4-3 2.4-5 0-8.4" />
          <path d="M24 19c-2.4-3 2.4-5.4 0-9" />
          <path d="M30 18c-2.4-3 2.4-5 0-8.4" />
        </g>
        <!-- 碗体 -->
        <path class="brand-logo__bowl" d="M9 26 Q24 46 39 26 Z" fill="#ffffff" />
        <!-- 碗口（内凹暗示开口） -->
        <ellipse cx="24" cy="26" rx="13.5" ry="2.6" fill="rgba(0,0,0,0.12)" />
        <path d="M9 26 Q24 31 39 26" fill="none" stroke="rgba(0,0,0,0.10)" stroke-width="1.4" />
      </svg>
    </span>
    <span v-if="variant !== 'mark'" class="brand-logo__text" :class="{ 'brand-logo__text--inverse': inverse }">
      <strong>知味</strong>
      <em v-if="tagline">外卖点餐平台</em>
    </span>
  </span>
</template>

<script>
export default {
  name: 'BrandLogo',
  props: {
    // full | mark
    variant: { type: String, default: 'full' },
    // 是否展示副标题
    tagline: { type: Boolean, default: true },
    // 深色背景上使用反白色字样
    inverse: { type: Boolean, default: false },
    // 标记内的蒸汽是否播放动画
    animated: { type: Boolean, default: false }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  user-select: none;

  &__mark {
    @include wh(44, 44);
    @include flex-center;
    flex-shrink: 0;
    background: linear-gradient(135deg, $color-primary, $color-primary-600);
    border-radius: $radius-lg;
    box-shadow: 0 6px 14px rgba(255, 83, 57, 0.34);
    overflow: hidden;
  }
  &__svg {
    @include wh(30, 30);
  }

  &__text {
    display: flex;
    flex-direction: column;
    line-height: 1.15;
    min-width: 0;
    strong {
      @include sc(19, $text-title);
      font-weight: 800;
      letter-spacing: 2px;
    }
    em {
      @include sc(11, $text-secondary);
      font-style: normal;
      letter-spacing: 1px;
      margin-top: 2px;
    }
    &--inverse {
      strong {
        color: #fff;
      }
      em {
        color: rgba(255, 255, 255, 0.66);
      }
    }
  }

  // 仅标记
  &--mark {
    .brand-logo__mark {
      @include wh(34, 34);
      border-radius: $radius-md;
    }
    .brand-logo__svg {
      @include wh(24, 24);
    }
  }
}

// 蒸汽轻微起伏动画（仅在大尺寸品牌区启用）
.brand-logo__mark--animated {
  .brand-logo__steam {
    transform-origin: 50% 100%;
    animation: logo-steam 3.2s ease-in-out infinite;
  }
  .brand-logo__bowl {
    transform-origin: 50% 70%;
    animation: logo-bowl 4.5s ease-in-out infinite;
  }
}
@keyframes logo-steam {
  0%, 100% { opacity: 0.85; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-1.2px); }
}
@keyframes logo-bowl {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}
@media (prefers-reduced-motion: reduce) {
  .brand-logo__mark--animated * {
    animation: none !important;
  }
}
</style>
