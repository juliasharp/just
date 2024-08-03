<script setup lang="ts">
import { gsap } from 'gsap';
import lottie from 'lottie-web';
import LogoShapes from '@/assets/header-shapes.json';
//import LogoShapes from '@/assets/header-shapes-new.json';

//TO DO: animation needs to happen on load: shapes scroll quickly together, 
//shrink and then video loads. When going back up, It should just play 
//the video on loop

//kill animation at 1200px
const lottieContainer = ref(null);

const initAnimations = () => {
  const lottieInstance = lottie.loadAnimation({
    container: lottieContainer.value,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    animationData: LogoShapes
  });

  gsap.timeline({
    scrollTrigger: {
      trigger: '.header-container',
      start: 'top top',
      end: window.innerHeight * 4 + ' top',
      pin: true,
      pinSpacing: true,
      scrub: 0.1,
      //markers: true,
    }
  });

  lottieInstance.addEventListener('DOMLoaded', () => {
    gsap.timeline({
      scrollTrigger: {
        trigger: '.header-container',
        end: window.innerHeight * 4 + ' top',
        scrub: 0.1
      }
    }).to(lottieInstance, {
      frame: lottieInstance.totalFrames - 1,
      duration: 1,
      onUpdate: () => lottieInstance.goToAndStop(lottieInstance.frame, true)
    });
  });
}

onMounted(() => {
  initAnimations();
})


</script>

<template>
  <div class="header-container">
    <div class="header__visual">
      <div class="js-lottie-container" ref="lottieContainer"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  &__visual {
    display: block;
    position: relative;
    height: 100vh;
  }
  &-container {
    display: block;
    position: relative;
    height: 100vh;
  }
}

.js-lottie-container {
  position: absolute;
  width: 100%;
  height: auto;
  //height: 100vh;
  display: block;
  //background: gray;
  z-index: 10;
  top: 50%;
  transform: translateY(-50%);
}
</style>