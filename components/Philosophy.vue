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
        <div class="text-inner">
          <p>Unjust systems have been by design - they can and must be redesigned!</p>
          <p>Our design approach is rooted in an understanding of the essential dynamics that foster healthy, equitable, and resilient projects - empowering our clients and outcomes by:</p>
          <ul>
            <li>Broadening awareness of what projects can and should be responsible for</li>
            <li>Uncovering and surfacing opportunities</li>
            <li>Providing tools to scaffold agency and culture</li>
            <li>Cultivating stewardship of Mother Earth</li>
          </ul>
        </div>
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
    @media (max-width: 1600px) {
      margin-top: 40px;
    }
    @media (max-width: 767px) {
      margin-top: 35px;
    }
    h2 {
      color: #ffffff;
      font-size: 3.6vw;
      line-height: 1.21;
      @media (max-width: 1600px) {
        font-size: 3vw;
      }
      span {
        font-family: 'Inter Bold';
      }
    }
  }
}

.text-inner {
  color: #FFFFFF;
  font-size: 36px;
  font-size: 2.5vw;
  margin-top: 45px;
  p:last-of-type {
    margin-top: 30px;
  }
  ul {
    margin-top: 38px;
    margin-left: 26px;
    font-size: 2vw;
    li:not(:first-of-type) {
      margin-top: 15px;
    }
  }
}
</style>