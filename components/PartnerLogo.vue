<script setup lang="ts">
defineProps({
  imageUrl: {
    type: String
  },
  imageAlt: {
    type: String,
  },
  link: {
    type: String
  }
})
</script>

<template>
  <div class="partner">
    <NuxtLink :to="link" target="_blank">
      <img :src="imageUrl" :alt="imageAlt" />
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
.partner {
  img {
    max-width: 160px;
    @media (max-width: 1600px) {
      max-width: 130px;
    }
    @media (max-width: 1280px) {
      max-width: 100px;
    }
  }
}
</style>