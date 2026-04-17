<script setup lang="ts">
defineProps<{
  color?: string
}>()

const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="footer-links flex justify-between res-gutter" :style="{ color: color ?? 'inherit' }">
    <div class="footer-links-left">
      <a href="https://www.instagram.com/__justdesign/" target="_blank">Instagram.</a>
      <a href="https://www.linkedin.com/company/just-design-inc/" target="_blank">LinkedIn.</a>
      <a href="mailto:info@just.design">Contact.</a>
    </div>
    <div class="footer-links-right">
      <p>Copyright © {{ currentYear }}. JUST Design.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer-links {
  padding-top: 20px;
  padding-bottom: 20px;
  position: relative;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: center;
    font-size: 16px;
  }

  &-left {
    @media (max-width: 767px) {
      margin-bottom: 8px;
    }

    a {
      color: inherit;
      &:not(:last-child) {
        margin-right: 30px;
      }
    }
  }

  &::before {
    content: '';
    display: block;
    width: calc(100% - 40px);
    left: 20px;
    height: 1px;
    background: currentColor;
    opacity: 0.3;
    position: absolute;
    top: 0;

    @media (min-width: 768px) {
      width: calc(100% - 60px);
      left: 30px;
    }
  }
}
</style>
