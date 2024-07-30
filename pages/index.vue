<script setup lang="ts">
const route = useRoute();

</script>

<template>
   <NuxtLayout name="default" page-name="home" title="Welcome">
      <!--Header Animation & Video -->
      <Header></Header>
      <!-- About -->
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
      padding: 120px 0;
      @media (max-width: 1600px) {
         padding: 105px 0;
      }
      @media (max-width: 760px) {
         padding: 65px 0;
      }
   }
   &-container {
      max-width: calc(100% - 240px);
      margin: 0 auto;
   }
}
</style>
