<script setup lang="ts">
import LogoSVG from '/src/alt-logo-white.svg?component';
const currentYear = computed(() => new Date().getFullYear());
</script>

<template>
  <div class="footer-bottom">
    <div class="footer-logo">
      <!-- <LogoSVG /> -->
    </div>
    <p class="footer-cta">THE FUTURE CAN BE JUST - DESIGN IT !</p>
    <div class="footer-img">
    </div>
    <div class="footer-bottom-content">
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

.footer-cta {
  color: #C6F250;
  font-family: 'Inter Bold';
  position: absolute;
  font-size: 28px;
  bottom: 58px;
  width: 100%;
  text-align: center;
  padding: 0 50px;
  @media (max-width: 1000px) {
    font-size: 25px;
  }
  @media (max-width: 767px) {
    font-size: 18px;
    padding: 0 20px;
  }
}

.footer-divider {
  margin: 0 50px;
  border: 0.5px solid #C6F250;
  @media (max-width: 767px) {
    margin: 0 20px;
  }
}

.copyright {
  margin: 0 50px;
  font-family: 'Inter Bold';
  text-transform: uppercase;
  font-size: 14px;
  padding: 14px 0;
  color: #C6F250;
  @media (max-width: 767px) {
    margin: 0 20px;
    font-size: 12px;
  }
}
</style>