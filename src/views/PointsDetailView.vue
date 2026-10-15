<template>
  <page-scaffold title="积分说明">
    <div class="doc">
      <h2>积分如何获得</h2>
      <ul>
        <li>每完成一笔有效订单，按实付金额获得积分</li>
        <li>参与评价、签到等活动可获得额外积分</li>
        <li>会员享有积分加速特权</li>
      </ul>

      <h2>积分能做什么</h2>
      <ul>
        <li>兑换无门槛红包</li>
        <li>参与积分商城兑换好礼</li>
        <li>抵扣部分订单金额（以页面提示为准）</li>
      </ul>

      <h2>温馨提示</h2>
      <p>积分有效期以活动规则为准，请及时使用；订单退款将扣回对应积分。</p>
    </div>
  </page-scaffold>
</template>

<script>
import PageScaffold from '@/components/base/PageScaffold.vue'

export default {
  name: 'PointsDetailView',
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
  ul {
    padding-left: rem(24);
    list-style: disc;
    li {
      margin: $space-xs 0;
    }
  }
  p {
    margin: $space-sm 0;
  }
}
</style>
