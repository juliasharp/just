<script setup lang="ts">
import ResidentialDesignJourney from '~/components/ResidentialDesignJourney.vue';
import ResidentialHero from '~/components/ResidentialHero.vue';
import ResidentialProjects from '~/components/ResidentialProjects.vue';
import ResidentialTestimonials from '~/components/ResidentialTestimonials.vue';

const config = useRuntimeConfig()

const query = `
  query HomePage {
    page(id: "234", idType: DATABASE_ID) {
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
  title: () => page.value?.title || 'JUST Design | Residential Architects & Designers',
  ogTitle: () => page.value?.title || 'JUST Design | Residential Architects & Designers',
  description: () => page.value?.content?.substring(0, 155) || 'JUST Design | Residential Architects & Designers',
  ogDescription: () => page.value?.content?.substring(0, 155) || 'JUST Design | Residential Architects & Designers',
  ogImage: () => image.value,
  twitterImage: () => image.value,
  twitterCard: 'summary_large_image',
})
</script>


<template>
  <NuxtLayout name="residential" page-name="JUST Design | Residential Architects & Designers" title="Residential| JUST Design">
    <main class="residential-page no-scroll-snap">
      <ResidentialHero />
      <ResidentialContent />
      <ResidentialContentGrid />
      <ResidentialProjects />
      <ResidentialTestimonials />
      <ResidentialDesignJourney />
      <ResidentialFooter/>
    </main>
  </NuxtLayout>
</template>

<style>
.residential-page {
  /* Ensure smooth scrolling */
  scroll-behavior: smooth;
}
</style>
