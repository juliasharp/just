<script setup lang="ts">
import ResidentialDesignJourney from '~/components/ResidentialDesignJourney.vue';
import ResidentialHero from '~/components/ResidentialHero.vue';
import ResidentialProjects from '~/components/ResidentialProjects.vue';
import ResidentialTestimonials from '~/components/ResidentialTestimonials.vue';

const route = useRoute();

const showContactForm = ref(false);

</script>

<template>
<<<<<<< Updated upstream
  <NuxtLayout name="residential" page-name="gateway" title="Residential| JUST Design">
    <ResidentialHero />
    <ResidentialContent />
    <ResidentialProjects />
    <ResidentialTestimonials />
    <ResidentialWhyJUST />
    <ResidentialDesignJourney />
    <ResidentialFooter/>
=======
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
>>>>>>> Stashed changes
  </NuxtLayout>
</template>

<style>
.residential-page {
  /* Ensure smooth scrolling */
  scroll-behavior: smooth;
}
</style>