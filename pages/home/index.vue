<script setup lang="ts">
import ResidentialDesignJourney from '~/components/ResidentialDesignJourney.vue';
import ResidentialHero from '~/components/ResidentialHero.vue';
import ResidentialProjects from '~/components/ResidentialProjects.vue';
import ResidentialTestimonials from '~/components/ResidentialTestimonials.vue';

const route = useRoute();

const showContactForm = ref(false);

</script>

<template>
  <NuxtLayout name="residential" page-name="JUST Design | Residential Architects & Designers" title="Residential| JUST Design">
    <ResidentialHero />
    <ResidentialContent />
    <ResidentialProjects />
    <ResidentialTestimonials />
    <ResidentialWhyJUST />
    <ResidentialDesignJourney />
    <ResidentialFooter/>
  </NuxtLayout>
</template>