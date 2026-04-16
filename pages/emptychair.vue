<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <NuxtLayout name="residential" :form-id="3" form-title="Contact Us" page-name="JUST Design | Residential Architects & Designers" title="JUST Design | Empty Chair">
    <main class="emptychair-page">
      <EmptyChairHero />
      <EmptyChairContent />
      <EmptyChairGallery />
      <EmptyChairTestimonials />
      <EmptyChairFooter />
    </main>
  </NuxtLayout>
</template>

<style lang="scss">
.emptychair-page {
  background: #000000;
  min-height: 100vh;
  font-family: var(--body-font-medium);
  color: #ffffff;
}

.ec-section-title {
  font-size: 16px;
  font-family: var(--font-family-code);
  letter-spacing: 0.05em;
  color: var(--accent-color-pink);
  text-transform: uppercase;
  grid-column: span 8;
  margin-bottom: 30px;
  @media (min-width: 768px) {
    font-size: 19px;
    margin-bottom: 40px;
  }
  @media (min-width: 1281px) {
    font-size: 20px;
  }
}
</style>