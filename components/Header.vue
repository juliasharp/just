<script setup lang="ts">
import { gsap } from 'gsap';
import lottie from 'lottie-web';
import LogoShapes from '@/assets/header-shapes.json';
//import LogoShapes from '@/assets/header-shapes-new.json';

//TO DO: animation needs to happen on load: shapes scroll quickly together, 
//shrink and then video loads. When going back up, It should just play 
//the video on loop

const lottieContainer = ref(null);

const showAnimation = ref(true);
const showVideo = ref(false);
const showLogo = ref(false);

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
    },
  });

  lottieInstance.addEventListener('DOMLoaded', () => {
    gsap.timeline({
      scrollTrigger: {
        trigger: '.header-container',
        end: window.innerHeight * 3 + ' top',
        scrub: 0.1
      }
    }).to(lottieInstance, {
      frame: lottieInstance.totalFrames - 1,
      duration: 1,
      onUpdate: () => lottieInstance.goToAndStop(lottieInstance.frame, true),
      onComplete: () => {
        showAnimation.value = false;
        showVideo.value = true;
      }
    });
  });
}

onMounted(() => {
  initAnimations();
})


</script>

<template>
  <div class="header-container">
    <div v-show="showAnimation" class="header__visual-outer">
      <div class="header__visual">
        <div class="js-lottie-container" ref="lottieContainer"></div>
      </div>
    </div>
    <div v-show="showVideo" class="header__video">
      <video muted loop autoplay playsinline="" src="https://just.julia-sharp.com/wp-content/uploads/2024/08/JUST-header-Video-DRAFT1.mp4" data-object-fit="contain"></video>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  &__visual {
    display: block;
    position: relative;
    height: 100vh;
    &-outer {
      position: relative;
      height: 100vh;
    }
  }
  &-container {
    display: block;
    position: relative;
    height: 100vh;
  }
  &__video {
    position: relative;
    height: 100vh;
    background: #C6F250;
    padding: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    video {
      position: absolute;
      width: calc(100% - 30px);
      height: calc(100% - 30px);
      object-fit: cover;
    }
    &:after {
      content: '';
      background: url('/src/alt-logo-acid.svg');
      width: 575px;
      height: 171px;
      position: absolute;
      @media (max-width: 1600px) {
        transform: scale(0.75);
      }
    }
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