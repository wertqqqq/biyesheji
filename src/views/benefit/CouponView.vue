<template>
  <page-scaffold title="代金券说明">
    <div class="doc">
      <h2>什么是代金券</h2>
      <p>代金券是平台与商家联合发行的优惠凭证，可在下单结算时直接抵扣订单金额。</p>

      <h3>如何获得</h3>
      <ul>
        <li>商家满减活动自动返还</li>
        <li>参与平台运营活动领取</li>
        <li>会员每月固定赠送</li>
      </ul>

      <h3>使用规则</h3>
      <ul>
        <li>每笔订单限用一张，不可叠加</li>
        <li>需满足券面标注的最低消费门槛</li>
        <li>不可提现、不可转赠，过期自动失效</li>
      </ul>

      <h3>温馨提示</h3>
      <p>如遇无法使用，请确认订单是否满足门槛，或联系客服协助处理。</p>
    </div>
  </page-scaffold>
</template>

<script>
import PageScaffold from '@/components/base/PageScaffold.vue'

export default {
  name: 'CouponView',
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
