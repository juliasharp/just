<script setup lang="ts">
const route = useRoute();

const config = useRuntimeConfig()

const query = `
  query HomePage {
    page(id: "435", idType: DATABASE_ID) {
      featuredImage {
        node {
          sourceUrl
        }
      }
      title
      content
    }
  }
`

const { data } = await useFetch(config.public.wordpressUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: { query }
})

const page = computed(() => (data.value as any)?.data?.page ?? null)
const image = computed(() => page.value?.featuredImage?.node?.sourceUrl ?? null)

useSeoMeta({
  title: () => page.value?.title || 'JUST Design | The Empty Chair -- making the avoidable unavoidable',
  ogTitle: () => page.value?.title || 'JUST Design | The Empty Chair',
  description: () => page.value?.content?.substring(0, 155) || 'JUST Design | The Empty Chair',
  ogDescription: () => page.value?.content?.substring(0, 155) || 'JUST Design | The Empty Chair',
  ogImage: () => image.value,
  twitterImage: () => image.value,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <NuxtLayout name="residential" :form-id="3" form-title="Contact Us" page-name="JUST Design | Residential Architects & Designers" title="JUST Design | Empty Chair">
    <main class="emptychair-page">
      <EmptyChairHero />
      <EmptyChairContent />
      <EmptyChairGallery />
      <EmptyChairTestimonials />
      <EmptyChairFooter />
    </main>
  </NuxtLayout>
</template>

<style lang="scss">
.emptychair-page {
  background: #000000;
  min-height: 100vh;
  font-family: var(--body-font-medium);
  color: #ffffff;
}

.ec-section-title {
  font-size: 16px;
  font-family: var(--font-family-code);
  letter-spacing: 0.05em;
  color: var(--accent-color-pink);
  text-transform: uppercase;
  grid-column: span 8;
  margin-bottom: 30px;
  @media (min-width: 768px) {
    font-size: 19px;
    margin-bottom: 40px;
  }
  @media (min-width: 1281px) {
    font-size: 20px;
  }
}
</style>