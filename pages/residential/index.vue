<script setup lang="ts">
import ResidentialHero from '~/components/ResidentialHero.vue';
import ResidentialProjects from '~/components/ResidentialProjects.vue';
import ResidentialTestimonials from '~/components/ResidentialTestimonials.vue';

const route = useRoute();

const showContactForm = ref(false);

onMounted(async () => {
  // ✅ dynamic import on the client
  const gsap = (await import('gsap')).default

  // now it's safe to use window/document/gsap
  const el = document.querySelector('[data-anim]')
  if (el) {
    gsap.to(el, { opacity: 1, duration: 0.6 })
  }
})
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