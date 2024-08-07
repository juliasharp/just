<script setup lang="ts">
const currentYear = computed(() => new Date().getFullYear());
</script>

<template>
  <div class="footer-bottom">
    <div class="footer-img">
      <!-- <NuxtImg src="/just-team.jpg" /> -->
    </div>
    <div class="footer-bottom-content">
      <!-- <p>THE FUTURE CAN BE JUST - DESIGN IT !</p> -->
      <hr class="footer-divider">
      <p class="copyright">copyright &copy; just {{ currentYear }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer-bottom {
  position: relative;
  height: 100vh;
  &-content {
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: end;
  }
}

.footer-img {
  position: absolute;
  width: 100%;
  height: 100vh;
  background-image: url('/public/just-team.jpg');
  z-index: -1;
  background-size: cover;
  background-position: center center;
  @media (max-width: 1100px) {
    background-image: url('/public/just-team-mobile.jpg');
  }
}

.footer-divider {
  margin: 0 50px;
  border: 0.5px solid #C6F250;
}

.copyright {
  margin: 0 50px;
  font-family: 'Inter Bold';
  text-transform: uppercase;
  font-size: 14px;
  padding: 14px 0;
  color: #C6F250;
}
</style>