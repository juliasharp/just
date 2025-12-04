<script setup lang="ts">
const route = useRoute();

const showContactForm = ref(false);
</script>

<template>
   <NuxtLayout name="default" page-name="home" title="JUST Design">
      <!--Header Animation & Video -->
      <ConsultingHero />
      <!-- About -->
      <ConsultingPhilosophy />
      <ConsultingEvergreen />
      <!-- Services -->
      <ConsultingServices />
      <!-- Projects -->
      <ConsultingProjects />
      <!-- Team -->
      <ConsultingTeam />
      <!-- Partners -->
      <ConsultingPartners />
      <!-- Team Photo -->
      <ConsultingFooter v-model:showForm="showContactForm"></ConsultingFooter>
      <ConsultingFooterImage />
  </NuxtLayout>
</template>

<style lang="scss" scoped>
.section {
   &-with-title {
      padding: 100px 0;
      @media (max-width: 1600px) {
         padding: 75px 0;
      }
      @media (max-width: 1180px) {
         padding: 65px 0;
      }
      @media (max-width: 760px) {
         padding: 55px 0;
      }
   }
   &-container {
      max-width: calc(100% - 240px);
      margin: 0 auto;
   }
}
</style>
