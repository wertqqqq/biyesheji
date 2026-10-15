<template>
  <page-scaffold title="下载 App" :back-to="'/account'">
    <div class="download">
      <div class="download__logo"><icon-img name="icon_386" size="xxl" /></div>
      <h1 class="download__name">知味</h1>
      <p class="download__slogan">发现附近好味道，一键点餐到家</p>

      <div class="download__qr">
        <div class="download__qr-box">QR</div>
        <p>扫码下载手机 App</p>
      </div>

      <div class="download__features">
        <div class="feature"><icon-img name="jisupeisong" size="md" />极速配送</div>
        <div class="feature"><icon-img name="youhuiquan" size="md" />天天有优惠</div>
        <div class="feature"><icon-img name="pinzhibaozheng" size="md" />品质保障</div>
      </div>

      <div class="download__btns">
        <app-button type="primary" size="lg" block @click="download('iOS')">iPhone 下载</app-button>
        <app-button type="ghost" size="lg" block @click="download('Android')">Android 下载</app-button>
      </div>
    </div>
  </page-scaffold>
</template>

<script>
import PageScaffold from '@/components/base/PageScaffold.vue'
import AppButton from '@/components/base/AppButton.vue'
import IconImg from '@/components/base/IconImg.vue'

export default {
  name: 'DownloadView',
  components: { PageScaffold, AppButton, IconImg },
  setup() {
    function download(os) {
      window.alert(`正在准备 ${os} 安装包（演示）`)
    }
    return { download }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.download {
  max-width: 1200px;
  margin: 0 auto;
  padding: $space-2xl $content-pad;
  text-align: center;
  // 顶部全宽渐变 hero：光斑 + 品牌渐变
  background:
    radial-gradient(560px 280px at 14% 0%, rgba(255, 255, 255, 0.3), transparent 62%),
    radial-gradient(480px 240px at 86% 6%, rgba(255, 214, 102, 0.4), transparent 60%),
    linear-gradient(135deg, #ff6a45, $color-primary);
  background-size: 100% 400px, 100% 400px, 100% 400px;
  background-repeat: no-repeat;
}
.download__logo {
  @include wh(88, 88);
  @include flex-center;
  margin: 0 auto $space-lg;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: $radius-xl;
  box-shadow: $shadow-pop;
  padding: 16px;
  box-sizing: border-box;
}
.download__name {
  @include sc(22, #fff);
  font-weight: 800;
  letter-spacing: 6px;
}
.download__slogan {
  margin-top: $space-sm;
  @include sc(14, rgba(255, 255, 255, 0.92));
}
.download__qr {
  display: flex;
  align-items: center;
  gap: $space-xl;
  max-width: 720px;
  margin: $space-2xl auto 0;
  padding: $space-xl;
  text-align: left;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  &-box {
    @include wh(148, 148);
    @include flex-center;
    flex-shrink: 0;
    @include sc(15, $text-secondary);
    background: $bg-page;
    border: 1px dashed $border-strong;
    border-radius: $radius-md;
  }
  p {
    @include sc(16, $text-title);
    font-weight: 600;
    line-height: 1.6;
  }
}
.download__features {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: $space-lg;
  max-width: 960px;
  margin: $space-lg auto 0;
}
.feature {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-sm;
  padding: $space-md $space-lg;
  @include sc(14, $text-body);
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  box-shadow: $shadow-card;
}
.download__btns {
  display: flex;
  justify-content: center;
  gap: $space-md;
  max-width: 480px;
  margin: $space-lg auto 0;
  .app-btn {
    flex: 1;
  }
}
</style>
