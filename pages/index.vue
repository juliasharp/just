<script setup lang="ts">
const route = useRoute();

</script>

<template>
   <NuxtLayout name="default" page-name="home" title="Welcome">
      <!--Header Animation & Video -->
      <Header></Header>
      <!-- About -->
      <!-- Services -->
      <Services></Services>
      <!-- Projects -->
      <!-- Team -->
      <!-- Partners -->
      <Partners></Partners>
      <!-- Team Photo -->
  </NuxtLayout>
</template>

<style lang="scss" scoped>
.section {
   &-with-title {
      padding: 150px 0;
   }
   &-container {
      max-width: calc(100% - 240px);
      margin: 0 auto;
   }
}
</style>
