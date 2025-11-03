<script setup lang="ts">
const config = useRuntimeConfig();
const query = `
  query NewQuery {
    page(id: "234", idType: DATABASE_ID) {
      residentialLp {
        heroImage {
          node {
            altText
            sourceUrl
          }
        }
      }
    }
  }
`;

const { data, error } = await useFetch(config.public.wordpressUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: {
    query
  },
  transform: (data: any) => {
    return {
      heroImage: data.data.page.residentialLp.heroImage.node
    }
  }
})

if (error.value) {
  console.error('Error fetching residential hero data:', error.value);
}
</script>

<template>
  <section class="hero-section">
    <div class="hero h-[100dvh]">
      <img
        v-if="data?.heroImage"
        :src="data.heroImage.sourceUrl"
        :alt="data.heroImage.altText"
        class="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  </section>
</template>