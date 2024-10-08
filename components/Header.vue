<script setup lang="ts">
import { gsap } from 'gsap';
import lottie from 'lottie-web';
import type { AnimationItem } from 'lottie-web';
import LogoShapes from '@/assets/just-shapes-NEWNEW.json';
import LogoShapesMobile from '@/assets/header-shapes-mobile.json';

const lottieContainer = ref<HTMLElement | null>(null);

const showAnimation = ref(true);
const showVideo = ref(false);

const videoUrl = ref('');

const config = useRuntimeConfig();
const encodedQuery = encodeURIComponent(`
  query NewQuery {
    page(id: "6", idType: DATABASE_ID) {
      landingPage {
        headerVideo {
          node {
            link
          }
        }
      }
    }
  }
  `
)

const { data, error } = await useFetch(`${config.public.wordpressUrl}?query=${encodedQuery}`, {
  method: 'get',
  transform: (data) => {
    if (data?.data?.page?.landingPage?.headerVideo?.node?.link) {
      return data.data.page.landingPage.headerVideo.node.link;
    } else {
      console.error("Unexpected response structure for headerVideo", data);
      return '';
    }
  }
});

if (error.value) {
  console.error('Error fetching video data:', error.value);
} else {
  videoUrl.value = data.value;
}

let currentLottieInstance: AnimationItem | null = null;
const isMobileView = ref(false); // Initial check for mobile view

const loadAnimation = (isMobile: boolean) => {
  // Destroy the previous Lottie instance if it exists
  if (currentLottieInstance) {
    currentLottieInstance.destroy();
  }

  const animationData = isMobile ? LogoShapesMobile : LogoShapes;

  // Load the appropriate animation based on the current view
  currentLottieInstance = lottie.loadAnimation({
    container: lottieContainer.value as HTMLElement,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    animationData: animationData,
  });

  currentLottieInstance.addEventListener('DOMLoaded', () => {
    const totalFrames = currentLottieInstance?.totalFrames || 0;

    const animationTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.header-container',
        start: 'top top',
        end: window.innerHeight + ' top',
        pin: true,
        pinSpacing: true,
        scrub: 0.2,
      },
    });

    animationTimeline.to(
      { frame: 0 },
      {
        frame: totalFrames - 1,
        duration: 1.2,
        ease: 'power1.inOut',
        onUpdate: function () {
          if (currentLottieInstance) {
            currentLottieInstance.goToAndStop(Math.round((this.targets() as any)[0].frame), true);
          }
        },
        onComplete: () => {
          showAnimation.value = false;
          showVideo.value = true;
        },
      }
    );
  });
};

const handleResize = () => {
  if (typeof window !== 'undefined') {
    const isNowMobile = window.innerWidth < 761;

    // Only reload the animation if the mobile/desktop view has changed
    if (isNowMobile !== isMobileView.value) {
      isMobileView.value = isNowMobile;
      loadAnimation(isMobileView.value); // Load the correct animation for the current view
    }
  }
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    // Initial check for mobile view after the component has mounted (client-side only)
    isMobileView.value = window.innerWidth < 761;
    loadAnimation(isMobileView.value); // Initialize the animation on mount

    window.addEventListener('resize', handleResize); // Add the resize event listener
  }

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize); // Cleanup event listener on unmount
  });
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
      <video muted loop autoplay playsinline="" :src="videoUrl" data-object-fit="contain"></video>
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
      padding: 5px;
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
        transform: scale(0.35);
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