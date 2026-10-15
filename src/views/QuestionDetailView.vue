<template>
  <page-scaffold title="问题详情">
    <div class="qdetail">
      <div v-if="loading" class="qdetail__state"><loading-block /></div>
      <error-block v-else-if="error" :text="error" @retry="load" />
      <template v-else-if="question">
        <h2 class="qdetail__q">{{ question.question }}</h2>
        <div class="qdetail__a">
          <p class="qdetail__a-label">解答</p>
          <p class="qdetail__a-text">{{ question.answer }}</p>
        </div>
      </template>
      <empty-block v-else icon="❓" text="问题不存在或已下架" />
    </div>
  </page-scaffold>
</template>

<script>
import { onMounted, ref } from 'vue'
import router from '@/router'
import { contentApi } from '@/api/modules/content'
import PageScaffold from '@/components/base/PageScaffold.vue'
import LoadingBlock from '@/components/base/LoadingBlock.vue'
import ErrorBlock from '@/components/base/ErrorBlock.vue'
import EmptyBlock from '@/components/base/EmptyBlock.vue'

export default {
  name: 'QuestionDetailView',
  components: { PageScaffold, LoadingBlock, ErrorBlock, EmptyBlock },
  setup() {
    const id = router.currentRoute.params.id
    const question = ref(null)
    const loading = ref(true)
    const error = ref('')

    async function load() {
      loading.value = true
      error.value = ''
      try {
        const data = await contentApi.serviceCenter()
        const all = (data.categories || []).flatMap((c) => c.questions)
        question.value = all.find((q) => q.id === id) || null
      } catch (e) {
        error.value = e.message || '加载失败'
      } finally {
        loading.value = false
      }
    }
    onMounted(load)

    return { question, loading, error, load }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.qdetail {
  max-width: 880px;
  margin: 0 auto;
  padding: 0 $content-pad $space-2xl;
}
.qdetail__state {
  padding-top: rem(80);
}
.qdetail__q {
  @include sc(20, $text-title);
  font-weight: 700;
  line-height: 1.4;
}
.qdetail__a {
  margin-top: $space-lg;
  padding: $card-pad;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  &-label {
    @include sc(14, $color-primary);
    font-weight: 600;
    margin-bottom: $space-sm;
  }
  &-text {
    @include sc(14, $text-body);
    line-height: 1.8;
  }
}
</style>
