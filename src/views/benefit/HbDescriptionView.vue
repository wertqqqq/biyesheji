<template>
  <page-scaffold title="红包说明">
    <div class="doc">
      <h2>关于红包</h2>
      <p>红包是平台给用户的现金抵扣权益，下单时可按规则抵扣相应金额。</p>

      <h3>红包类型</h3>
      <ul>
        <li>店铺红包：仅限指定商家使用</li>
        <li>平台红包：全平台通用（特定品类除外）</li>
        <li>新人专享：首次下单可叠加使用</li>
      </ul>

      <h3>使用与兑换</h3>
      <ul>
        <li>结算页在「红包」中选择可用红包</li>
        <li>可通过兑换码在「兑换红包」页兑换</li>
        <li>过期红包可在「历史红包」中查看</li>
      </ul>

      <h3>注意事项</h3>
      <p>红包不可提现；使用后若订单退款，红包将按规定退回或失效，具体以退款结果为准。</p>
    </div>
  </page-scaffold>
</template>

<script>
import PageScaffold from '@/components/base/PageScaffold.vue'

export default {
  name: 'HbDescriptionView',
  components: { PageScaffold }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.doc {
  max-width: 1280px;
  margin: 0 auto;
  padding: $content-pad;
  padding-bottom: $space-2xl;
  @include sc(14, $text-body);
  line-height: 1.8;
  h2 {
    @include sc(20, $text-title);
    margin-bottom: $space-md;
  }
  h3 {
    @include sc(16, $text-title);
    margin: $space-lg 0 $space-sm;
  }
  p {
    margin: $space-sm 0;
  }
  ul {
    padding-left: rem(24);
    list-style: disc;
    li {
      margin: $space-xs 0;
    }
  }
}
</style>
