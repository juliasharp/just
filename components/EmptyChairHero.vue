<script setup lang="ts">
const config = useRuntimeConfig()

const query = `
  query NewQuery {
    page(id: "435", idType: DATABASE_ID) {
      emptyChair {
        headerScrollingText
        emptyChairComic {
          node {
            altText
            sourceUrl
          }
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
      headerScrollingText: d?.data?.page?.emptyChair?.headerScrollingText,
      emptyChairComic: d?.data?.page?.emptyChair?.emptyChairComic?.node ?? null,
    }
  }
})

if (error.value) console.error('Error fetching empty chair data:', error.value)

// Enough copies to fill the viewport before the seamless duplicate kicks in

</script>

<template>
  <div class="emptychair-hero">
    <ScrollingText v-if="data?.headerScrollingText" :text="data.headerScrollingText" />
    <div v-if="data?.emptyChairComic" class="comic-container mt-8 md:mt-16">
      <img
        :src="data.emptyChairComic.sourceUrl"
        :alt="data.emptyChairComic.altText || 'Empty Chair Comic'"
        class="comic-img"
        decoding="async"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.emptychair-hero {
  padding-top: 4rem;
  @media (min-width: 768px) {
    padding-top: 8.5625rem;
  }
}

.comic-container {
  display: flex;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
}

.comic-img {
  display: block;
  max-width: 100%;
  height: auto;
}

.marquee {
  overflow: hidden;
  width: 100%;
  white-space: nowrap;
}

.marquee__track {
  display: inline-flex;
  min-width: 200%;
  animation: marquee-scroll 40s linear infinite;
}

.marquee__item {
  flex-shrink: 0;
  padding-right: 1em;
}

@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
</style>