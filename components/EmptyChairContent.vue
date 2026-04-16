<script setup lang="ts">
const config = useRuntimeConfig()

const query = `
  query NewQuery {
    page(id: "435", idType: DATABASE_ID) {
      emptyChair {
        contentSectionTitle
          emptyChairContent {
          content
          heading
        }
      }
    }
  }
`

const { data, error } = await useFetch(config.public.wordpressUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: { query },
  transform: (d: any) => {
    return {
      contentSectionTitle: d?.data?.page?.emptyChair?.contentSectionTitle,
      emptyChairContent: d?.data?.page?.emptyChair?.emptyChairContent ?? [],
    }
  }
})

</script>

<template>
  <div class="emptychair-content ec-container">
    <h2 class="content-section-title ec-section-title">{{ data?.contentSectionTitle }}</h2>
    <div class="content-items">
      <div v-for="item in data?.emptyChairContent" :key="item.heading" class="content-item">
        <h3 class="title">{{ item.heading }}</h3>
        <div v-html="item.content" class="text"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  &-item {
    @media (min-width: 768px) {
      display: flex;
      padding: 20px 0 60px;
      font-size: 19px;
    }
    &s {
      @media (min-width: 768px) {
        grid-column: 11 / 24;
      }
    }
    &:not(:first-of-type) {
      border-top: 1px solid #707070;
      @media (max-width: 767px) {
        padding-top: 1rem;
      }
    }
  }
}

.title {
  font-family: var(--body-font-bold);
  color: var(--accent-color-yellow);
  text-transform: none;
  @media (min-width: 768px) {
    width: 21.7rem;
  }
  @media (max-width: 767px) {
    margin-bottom: 1.25rem;
  }
}

.text {
  color: #fff;
  :deep(p) {
    margin-bottom: 24px;
  }
  @media (min-width: 601px) {
    width: 33.5rem;
    margin-left: auto;
  }
}
</style>