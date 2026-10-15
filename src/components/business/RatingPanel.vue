<template>
  <div class="rating">
    <div v-if="loadingScores" class="rating__state"><loading-block text="评价加载中…" /></div>
    <error-block v-else-if="scoresError" :text="scoresError" @retry="init" />

    <template v-else>
      <div class="rating__summary">
        <div class="rating__overall">
          <p class="rating__overall-num">{{ scores.overall ? scores.overall.toFixed(1) : '--' }}</p>
          <p class="rating__overall-label">综合评分</p>
          <star-rating :rating="scores.overall || 0" size="sm" />
        </div>
        <div class="rating__dims">
          <div class="rating__dim"><span>服务</span><b>{{ scores.service || '--' }}</b></div>
          <div class="rating__dim"><span>口味</span><b>{{ scores.food || '--' }}</b></div>
          <div class="rating__dim"><span>配送</span><b>{{ scores.delivery || '--' }}</b></div>
        </div>
      </div>

      <div class="rating__tags">
        <button
          v-for="(t, i) in tags"
          :key="i"
          type="button"
          class="rating__tag"
          :class="{ 'is-on': activeTag === t.name, 'is-bad': t.unsatisfied }"
          @click="selectTag(t)"
        >
          {{ t.name }} {{ t.count }}
        </button>
      </div>

      <div class="rating__list">
        <div v-if="listLoading && !list.length" class="rating__state"><loading-block /></div>
        <empty-block
          v-else-if="!list.length && !listLoading"
          icon="💬"
          text="暂无相关评价"
        />
        <article v-for="r in list" :key="r.id" class="review">
          <div class="review__avatar">{{ r.avatar }}</div>
          <div class="review__body">
            <div class="review__head">
              <span class="review__user">{{ r.username }}</span>
              <star-rating :rating="r.rating" size="xs" />
            </div>
            <p class="review__time">{{ r.timeAgo }}</p>
            <p class="review__text">{{ r.text }}</p>
            <p v-if="r.orderItems && r.orderItems.length" class="review__items">
              点了：{{ r.orderItems.join('、') }}
            </p>
          </div>
        </article>
        <div class="rating__more">
          <loading-block v-if="listLoading" inline />
          <button v-else-if="!finished" type="button" class="rating__more-btn" @click="loadMore">
            加载更多评价
          </button>
          <p v-else class="rating__end">— 没有更多评价了 —</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { shopApi } from '@/api/modules/shop'
import StarRating from '../base/StarRating.vue'
import LoadingBlock from '../base/LoadingBlock.vue'
import ErrorBlock from '../base/ErrorBlock.vue'
import EmptyBlock from '../base/EmptyBlock.vue'

export default {
  name: 'RatingPanel',
  components: { StarRating, LoadingBlock, ErrorBlock, EmptyBlock },
  props: {
    shopId: { type: String, required: true }
  },
  setup(props) {
    const scores = ref({})
    const tags = ref([])
    const activeTag = ref('')
    const list = ref([])
    const offset = ref(0)
    const finished = ref(false)
    const loadingScores = ref(true)
    const listLoading = ref(false)
    const scoresError = ref('')
    const PAGE = 8

    async function init() {
      loadingScores.value = true
      scoresError.value = ''
      try {
        const [s, t] = await Promise.all([
          shopApi.ratingScores(props.shopId),
          shopApi.ratingTags(props.shopId)
        ])
        scores.value = s || {}
        tags.value = t || []
        activeTag.value = ''
        await loadRatings(true)
      } catch (e) {
        scoresError.value = e.message || '评价加载失败'
      } finally {
        loadingScores.value = false
      }
    }

    async function loadRatings(isReset) {
      if (listLoading.value) return
      listLoading.value = true
      try {
        const currentOffset = isReset ? 0 : offset.value
        const res = await shopApi.ratings(props.shopId, currentOffset, activeTag.value)
        const items = (res && res.list) || []
        list.value = isReset ? items : list.value.concat(items)
        offset.value = currentOffset + items.length
        finished.value = !(res && res.hasMore)
      } catch (e) {
        if (isReset) scoresError.value = e.message || '评价加载失败'
      } finally {
        listLoading.value = false
      }
    }

    function selectTag(t) {
      activeTag.value = activeTag.value === t.name ? '' : t.name
      loadRatings(true)
    }
    function loadMore() {
      loadRatings(false)
    }

    onMounted(init)

    return {
      scores,
      tags,
      activeTag,
      list,
      finished,
      loadingScores,
      listLoading,
      scoresError,
      selectTag,
      loadMore,
      init
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.rating {
  padding-bottom: $space-xl;
}
.rating__state {
  padding: rem(40) 0;
}

.rating__summary {
  display: flex;
  gap: $space-lg;
  padding: $space-lg;
  background: $bg-card;
  border-radius: $radius-md;
  margin-bottom: $space-md;
}
.rating__overall {
  text-align: center;
  padding-right: $space-lg;
  border-right: 1px solid $border-color;
  &-num {
    @include sc(56, $color-accent);
    font-weight: 800;
    line-height: 1;
  }
  &-label {
    @include sc(20, $text-secondary);
    margin: rem(6) 0;
  }
}
.rating__dims {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: rem(14);
}
.rating__dim {
  @include flex-between;
  @include sc(24, $text-body);
  b {
    color: $color-accent;
    font-weight: 700;
  }
}

.rating__tags {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
  padding: 0 $space-md $space-md;
}
.rating__tag {
  padding: rem(10) rem(20);
  @include sc(22, $text-body);
  background: $bg-card;
  border-radius: $radius-pill;
  &.is-on {
    color: #fff;
    background: $color-accent;
    font-weight: 600;
  }
  &.is-bad {
    color: $text-secondary;
  }
}

.rating__list {
  padding: 0 $space-md;
}
.review {
  display: flex;
  gap: $space-md;
  padding: $space-md 0;
  border-bottom: 1px solid $border-color;
  &__avatar {
    @include wh(72, 72);
    @include flex-center;
    @include sc(40, $text-body);
    background: $bg-page;
    border-radius: 50%;
    flex-shrink: 0;
  }
  &__body {
    flex: 1;
    min-width: 0;
  }
  &__head {
    @include flex-between;
  }
  &__user {
    @include sc(26, $text-title);
    font-weight: 600;
  }
  &__time {
    @include sc(20, $text-placeholder);
    margin: rem(4) 0 rem(8);
  }
  &__text {
    @include sc(26, $text-body);
    line-height: 1.5;
  }
  &__items {
    margin-top: rem(8);
    @include sc(20, $text-placeholder);
  }
}

.rating__more {
  padding: $space-lg 0;
  text-align: center;
}
.rating__more-btn {
  padding: rem(12) rem(28);
  @include sc(24, $color-primary);
  border: 1px solid $color-primary;
  border-radius: $radius-pill;
}
.rating__end {
  @include sc(22, $text-placeholder);
}
</style>
