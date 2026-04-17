<script lang="ts" setup>
const config = useRuntimeConfig();

const testimonialsQuery = encodeURIComponent(`
  query NewQuery {
    page(id: "435", idType: DATABASE_ID) {
      emptyChair {
        testimonialsSectionTitle
        test {
          quote
          authorTitle
        }
      }
    }
  }
`);

const { data, error } = await useFetch(`${config.public.wordpressUrl}?query=${testimonialsQuery}`, {
  method: 'get',
  headers: {
    'Content-Type': 'application/json',
  },
  transform: (d: any) => {
    return {
      testimonialsSectionTitle: d?.data?.page?.emptyChair?.testimonialsSectionTitle,
      testimonials: d?.data?.page?.emptyChair?.test ?? [],
    }
  }
});
</script>

<template>
  <div class="emptychair-testimonials">
    <div class="ec-container">
      <h2 class="testimonials-section-title ec-section-title">{{ data?.testimonialsSectionTitle }}</h2>
    </div>
    <Testimonials :testimonials="data?.testimonials ?? []" />
</div>
</template>