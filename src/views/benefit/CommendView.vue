<template>
  <page-scaffold title="推荐有奖">
    <div class="commend">
      <div class="commend__hero">
        <div class="commend__gift">🎁</div>
        <h2>邀请好友，各得红包</h2>
        <p>好友首单完成后，你和好友都能获得红包奖励</p>
      </div>

      <div class="commend__code">
        <span class="commend__code-label">我的邀请码</span>
        <span class="commend__code-value">{{ inviteCode }}</span>
        <button type="button" class="commend__code-copy" @click="copy">复制</button>
      </div>

      <div class="commend__steps">
        <h3>如何邀请</h3>
        <div class="step"><span class="step__num">1</span><span>复制邀请码或分享链接给好友</span></div>
        <div class="step"><span class="step__num">2</span><span>好友注册并完成首单</span></div>
        <div class="step"><span class="step__num">3</span><span>双方自动获得红包奖励</span></div>
      </div>

      <div class="commend__submit">
        <app-button type="primary" size="lg" block @click="share">分享给好友</app-button>
      </div>
    </div>
  </page-scaffold>
</template>

<script>
import { computed } from 'vue'
import store from '@/stores'
import PageScaffold from '@/components/base/PageScaffold.vue'
import AppButton from '@/components/base/AppButton.vue'

export default {
  name: 'CommendView',
  components: { PageScaffold, AppButton },
  setup() {
    const inviteCode = computed(() => {
      const id = store.getters['user/userId']
      return id ? `ZW${id.toUpperCase()}` : 'ZWTEST01'
    })

    function copy() {
      const text = inviteCode.value
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(
          () => window.alert('邀请码已复制'),
          () => window.alert(text)
        )
      } else {
        window.alert(`邀请码：${text}`)
      }
    }
    function share() {
      window.alert('已生成分享链接（演示）')
    }

    return { inviteCode, copy, share }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.commend {
  max-width: 1280px;
  margin: 0 auto;
  padding: $content-pad;
  padding-bottom: $space-2xl;
}
.commend__hero {
  text-align: center;
  padding: $space-xl 0;
  h2 {
    @include sc(20, $text-title);
    font-weight: 800;
    margin: $space-md 0 $space-sm;
  }
  p {
    @include sc(13, $text-secondary);
  }
}
.commend__gift {
  @include sc(48, $text-title);
}
.commend__code {
  @include flex-between;
  gap: $space-md;
  padding: $space-lg;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  &-label {
    @include sc(13, $text-secondary);
  }
  &-value {
    flex: 1;
    margin: 0 $space-md;
    @include sc(22, $color-primary);
    font-weight: 800;
    letter-spacing: 2px;
  }
  &-copy {
    padding: $space-sm $space-lg;
    @include sc(13, #fff);
    background: $color-primary;
    border-radius: $radius-pill;
    flex-shrink: 0;
    transition: background-color $transition-fast;
    &:hover {
      background: $color-primary-600;
    }
  }
}
.commend__steps {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $space-md;
  align-items: start;
  margin-top: $space-xl;
  h3 {
    grid-column: 1 / -1;
    @include sc(16, $text-title);
    margin-bottom: 0;
  }
}
.step {
  display: flex;
  align-items: center;
  gap: $space-md;
  padding: $space-md $space-lg;
  @include sc(13, $text-body);
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  &__num {
    @include wh(28, 28);
    @include flex-center;
    @include sc(13, #fff);
    font-weight: 700;
    background: $color-primary;
    border-radius: 50%;
    flex-shrink: 0;
  }
}
.commend__submit {
  max-width: 480px;
  margin: $space-xl auto 0;
}
</style>
