<script setup lang="ts">
import { gsap } from 'gsap';
import lottie from 'lottie-web';
import LogoShapes from '@/assets/just-shapes-NEWNEW.json';

const lottieContainer = ref(null);

const showAnimation = ref(true);
const showVideo = ref(false);

const initAnimations = () => {
  const lottieInstance = lottie.loadAnimation({
    container: lottieContainer.value,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    animationData: LogoShapes
  });

  // Ensure the lottie instance is properly initialized
  lottieInstance.addEventListener('DOMLoaded', () => {
    const totalFrames = lottieInstance.totalFrames;

    // Create GSAP timeline after Lottie is loaded
    const animationTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.header-container',
        start: 'top top',
        end: window.innerHeight + ' top',
        pin: true,
        pinSpacing: true,
        scrub: 0.2,
        // markers: true, // Uncomment for debugging scroll positions
      },
    });

    // Animate Lottie frames
    animationTimeline.to(
      { frame: 0 },
      {
        frame: totalFrames - 1,
        duration: 1.2,
        ease: 'power1.inOut',
        onUpdate: function () {
          lottieInstance.goToAndStop(Math.round(this.targets()[0].frame), true);
        },
        onComplete: () => {
          showAnimation.value = false;
          showVideo.value = true;
        }
      }
    );
    // animationTimeline.call(() => {}, null, '+=1');
  });
};

onMounted(() => {
  initAnimations();
});
</script>

<template>
  <div class="header-container">
    <div v-show="showAnimation" class="header__visual-outer">
      <div class="header__visual">
        <div class="js-lottie-container" ref="lottieContainer"></div>
      </div>
    </div>
    <div v-show="showVideo" class="header__video">
      <video muted loop autoplay playsinline="" src="http://wp.just.design/wp-content/uploads/2024/08/JustWebpage-FINAL.mp4" data-object-fit="contain"></video>
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
    overflow: hidden;
  }
  &__video {
    position: relative;
    height: 100vh;
    background: #C6F250;
    padding: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    @media (max-width: 760px) {
      padding: 7px;
    }
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
      @media (max-width: 1400px) {
        transform: scale(0.65);
      }
      @media (max-width: 1180px) {
        transform: scale(0.5);
      }
      @media (max-width: 760px) {
        transform: scale(0.25);
      }
    }
  }
}

.js-lottie-container {
  position: absolute;
  width: 100vw;
  // height: auto;
  height: 100vh;
  display: block;
  background: black;
  z-index: 10;
  top: 0;
  left: 0;
}
</style>