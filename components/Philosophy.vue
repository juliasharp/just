<script setup lang="ts">
const initAnimations = () => {
  //gsap.registerPlugin(ScrollTrigger);

  // const lottieInstance = lottie.loadAnimation({
  //   container: lottieContainer.value,
  //   renderer: 'svg',
  //   loop: false,
  //   autoplay: false,
  //   animationData: ACDAnimation
  // });

  gsap.timeline({
    scrollTrigger: {
      trigger: '.philosophy',
      start: 'top top',
      end: window.innerHeight + ' top',
      pin: true,
      pinSpacing: true,
      scrub: 0.2,
      markers: true,
    }
  });

  ScrollTrigger.normalizeScroll(true);
}

onMounted(() => {
  initAnimations();
});
</script>

<template>
  <div class="philosophy section-with-title">
    <div class="philosophy-container">
      <SectionTitle title="who we are" color="pink"></SectionTitle>
      <div class="philosophy-text">
        <h2><span>JUST</span> is a creative agency of activists and experts, designing equitable futures <span>NOW</span> !</h2>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.philosophy {
  position: relative;
  height: 100vh;
  background: #400A82;
  &-container {
    padding-left: 80px;
    padding-right: 80px;
    max-width: 1825px;
    @media (max-width: 767px) {
      padding-left: 30px;
      padding-right: 30px;
    }
  }
  &-text {
    margin-top: 60px;
    @media (max-width: 767px) {
      margin-top: 35px;
    }
    h2 {
      color: #ffffff;
      font-size: 3.6vw;
      line-height: 1.21;
      span {
        font-family: 'Inter Bold';
      }
    }
  }
}
</style>