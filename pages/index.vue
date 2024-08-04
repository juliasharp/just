<script setup lang="ts">
const route = useRoute();

</script>

<template>
   <NuxtLayout name="default" page-name="home" title="Welcome">
      <!--Header Animation & Video -->
      <Header></Header>
      <!-- About -->
      <Philosophy />
      <Evergreen />
      <!-- Services -->
      <Services />
      <!-- Projects -->
      <Projects />
      <!-- Team -->
      <Team />
      <!-- Partners -->
      <Partners />
      <!-- Team Photo -->
  </NuxtLayout>
</template>

<style lang="scss" scoped>
.section {
   &-with-title {
      padding: 100px 0;
      @media (max-width: 1600px) {
         padding: 95px 0;
      }
      @media (max-width: 1180px) {
         padding: 65px 0;
      }
   }
   &-container {
      max-width: calc(100% - 240px);
      margin: 0 auto;
   }
}
</style>
