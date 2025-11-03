<script setup lang="ts">
import ResidentialHero from '~/components/ResidentialHero.vue';
import ResidentialProjects from '~/components/ResidentialProjects.vue';
import ResidentialTestimonials from '~/components/ResidentialTestimonials.vue';

const route = useRoute();

const showContactForm = ref(false);
</script>

<template>
  <NuxtLayout name="residential" page-name="gateway" title="Residential| JUST Design">
    <LogoNav v-model:showForm="showContactForm"/>
    <ResidentialHero />
    <ResidentialContent />
    <ResidentialProjects />
    <ResidentialTestimonials />
    <ResidentialWhyJUST />
  </NuxtLayout>
</template>