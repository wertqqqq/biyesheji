<template>
  <page-scaffold title="发现">
    <div class="find">
      <section class="find__banner">
        <p class="find__banner-title">本周热搜榜</p>
        <p class="find__banner-sub">看看大家都在吃什么</p>
      </section>

      <div class="find__list">
        <article v-for="(a, i) in articles" :key="i" class="article" @click="open(a)">
          <div class="article__cover" :style="{ background: a.gradient }"><span>{{ a.emoji }}</span></div>
          <div class="article__body">
            <h3 class="article__title ellipsis-2">{{ a.title }}</h3>
            <p class="article__meta">{{ a.tag }} · {{ a.reads }} 阅读</p>
          </div>
        </article>
      </div>
    </div>
  </page-scaffold>
</template>

<script>
import { ref } from 'vue'
import PageScaffold from '@/components/base/PageScaffold.vue'

export default {
  name: 'FindView',
  components: { PageScaffold },
  setup() {
    const articles = ref([
      {
        title: '秋日暖胃：这 5 家麻辣香锅值得一试',
        tag: '美食攻略',
        reads: 1280,
        emoji: '🌶️',
        gradient: 'linear-gradient(135deg, #ff9a63, #ff5a3c)'
      },
      {
        title: '下午茶标配，奶茶点单不踩雷指南',
        tag: '饮品',
        reads: 986,
        emoji: '🧋',
        gradient: 'linear-gradient(135deg, #c084fc, #8b5cf6)'
      },
      {
        title: '轻食一周打卡，吃得饱也能瘦',
        tag: '健康',
        reads: 764,
        emoji: '🥗',
        gradient: 'linear-gradient(135deg, #7ee8a2, #22c55e)'
      },
      {
        title: '深夜食堂：城市里那些治愈系烧烤',
        tag: '夜宵',
        reads: 1532,
        emoji: '🍢',
        gradient: 'linear-gradient(135deg, #fdba74, #f97316)'
      }
    ])

    function open() {
      window.alert('文章详情演示')
    }

    return { articles, open }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.find {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $content-pad $space-2xl;
}
.find__banner {
  padding: $space-xl $space-2xl;
  background:
    radial-gradient(480px 220px at 85% 20%, rgba(255, 214, 102, 0.35), transparent 60%),
    linear-gradient(135deg, $color-primary, $color-primary-600);
  border-radius: $radius-xl;
  color: #fff;
  margin-bottom: $space-xl;
  box-shadow: $shadow-card;
  &-title {
    @include sc(22, #fff);
    font-weight: 800;
  }
  &-sub {
    margin-top: $space-xs;
    @include sc(14, rgba(255, 255, 255, 0.9));
  }
}
.find__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $space-lg;
  align-items: start;
}
.article {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  cursor: pointer;
  @include hover-lift;
  &:hover {
    border-color: rgba(255, 83, 57, 0.35);
    .article__title {
      color: $color-primary;
    }
  }
  &__cover {
    @include wh(100%, 160);
    @include flex-center;
    flex-shrink: 0;
    span {
      @include sc(56, #fff);
    }
  }
  &__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: $space-sm;
    padding: $space-md $space-lg $space-lg;
  }
  &__title {
    @include sc(16, $text-title);
    font-weight: 600;
    line-height: 1.5;
    transition: color $transition-fast;
  }
  &__meta {
    @include sc(12, $text-placeholder);
  }
}
</style>
