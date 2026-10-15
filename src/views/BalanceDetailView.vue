<template>
  <page-scaffold title="余额说明">
    <div class="doc">
      <h2>余额是什么</h2>
      <p>余额是你在平台账户中的可消费金额，可用于抵扣订单，不可提现、不可转赠。</p>

      <h2>如何充值</h2>
      <ul>
        <li>进入「我的 → 我的余额 → 余额充值」</li>
        <li>选择充值金额并完成支付</li>
        <li>充值实时到账，部分活动可享赠送优惠</li>
      </ul>

      <h2>使用规则</h2>
      <ul>
        <li>余额优先于其他支付方式抵扣</li>
        <li>退款订单金额将退回至余额</li>
        <li>如有疑问，请联系客服协助处理</li>
      </ul>
    </div>
  </page-scaffold>
</template>

<script>
import PageScaffold from '@/components/base/PageScaffold.vue'

export default {
  name: 'BalanceDetailView',
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
