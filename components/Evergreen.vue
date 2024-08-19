<script setup lang="ts">
import { gsap } from 'gsap';
import lottie from 'lottie-web';
import ACDAnimation from '@/assets/ACD-arrow-animation.json';

const textContainer = ref(null);

const lottieContainer = ref(null);
const currentText = ref('');
const currentHeader = ref('');
const currentTextHeader = ref('');
const headers = ['ACT ', ' COLLABORATE ', ' DESIGN'];
const dataHeaders = ['DETERMINE YOUR ACTION', 'BUILD YOUR TEAM', 'CREATE AND REALIZE'];
const data = [
  `<p><span style="font-family: 'Inter Bold'">JUST Act</span> is your opportunity to envision and plan the actions we will take together in designing your project. <span style="font-family: 'Inter Bold'">JUST Act</span> is also our non-profit equity engine, partnering to build the just legacy you want to see in the world!</p>`, 
  `JUST is your access to engage diverse expertise and perspectives to inform and guide your project. Drawing on decades of experience from designers, creatives, subject matter experts, leaders, and activists, <span style="font-family: 'Inter Bold'">JUST Collaborate</span> is your platform to imagine, innovate, and implement!`, 
  `With a project specific approach, <span style="font-family: 'Inter Bold'">JUST Design</span> will integrate our expertise in creating and guiding equitable processes to work with you to develop your project through key phases of design, and bring it to life!`
];
const currentIndex = ref(0);

const handleTextChange = (index) => {
  if (index >= data.length || index === currentIndex.value) return;
  
  const textElement = textContainer.value;
  const newText = data[index];
  const newTextHeader = dataHeaders[index];
  const newHeader = headers.slice(0, index + 1).join('  +  ');
  
  gsap.to(textElement, {
    opacity: 0,
    duration: 0.2,
    onComplete: () => {
      currentText.value = newText;
      currentHeader.value = newHeader;
      currentTextHeader.value = newTextHeader;
      gsap.to(textElement, { opacity: 1, duration: 0.2, delay: 0.1 });
    }
  });

  currentIndex.value = index;
};

const initAnimations = () => {
  const lottieInstance = lottie.loadAnimation({
    container: lottieContainer.value,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    animationData: ACDAnimation
  });

  gsap.timeline({
    scrollTrigger: {
      trigger: '.js-section-scroller',
      start: 'top top',
      end: () => `+=${window.innerHeight * data.length}`,
      pin: true,
      pinSpacing: true,
      scrub: 0.2,
      // markers: true,
      onUpdate: (self) => {
        const segmentIndex = Math.floor(self.progress / (1 / data.length));
        handleTextChange(segmentIndex);
        const frame = Math.min(lottieInstance.totalFrames * self.progress, lottieInstance.totalFrames - 1);
        lottieInstance.goToAndStop(frame, true);
      },
      onLeave: () => {
        lottieInstance.goToAndStop(lottieInstance.totalFrames - 1, true);
      }
    }
  });
};

onMounted(() => {
  currentText.value = data[0];
  currentHeader.value = headers[0];
  currentTextHeader.value = dataHeaders[0];
  initAnimations();
});

onBeforeUnmount(() => {
  gsap.killTweensOf(textContainer.value);
});
</script>

<template>
<div class="evergreen">
  <div class="section-bg">
    <div class="evergreen-inner">
      <div class="section-scroller js-section-scroller">
         <div class="section-scroller__inner">
          <div class="section-scroller__header">
            <div class="evergreen-textHeader" ref="textHeader">{{ currentTextHeader }}</div>
            <div class="evergreen-text" ref="textContainer" v-html="currentText"></div>
          </div>
          <div class="evergreen__visual">
            <div class="js-lottie-container" ref="lottieContainer"></div>
          </div>
          <div class="evergreen__footer">
            <div class="header-item" :ref="'headerContainer'">
              {{ currentHeader }}
            </div>
          </div>
        </div> 
      </div>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
.evergreen {
  position: relative;
  width: 100%;
  &-inner {
    // padding: 148px 80px 50px;
    padding: 30px 80px 50px;
    max-width: 1825px;
    margin: 0 auto;
    @media (max-width: 1600px) {
      padding: 105px 50px 50px;
    }
    @media (max-width: 760px) {
      padding: 85px 20px 100px;
    }
  }
  &__visual {
    position: unset;
  }
  &__footer {
    display: flex;
    flex-direction: column;
    justify-content: end;
  }
  &-text {
    color: #C6F250;
    font-size: 32px;
    line-height: 1.35;
    height: 120px;
    @media (max-width: 1600px) {
      font-size: 30px;
    } 
    @media (max-width: 1480px) {
      font-size: 25px;
    } 
    @media (max-width: 767px) {
      font-size: 18px;
    }
    span {
      font-family: 'Inter Bold';
    }
    &Header {
      font-family: 'Inter Bold';
      font-size: 48px;
      padding-bottom: 24px;
      color: #C6F250;
      @media (max-width: 1600px) {
        font-size: 40px;
      }
      @media (max-width: 760px) {
        font-size: 22px;
      }
    }
  }
}

.section-bg {
  width: 100%;
  height: 100%;
  background-color: #4D572D;
}

h2 {
  font-family: 'Inter Bold';
  font-size: 60px;
  line-height: 1.33;
  color: #C6F250;
  @media (max-width: 1600px) {
    font-size: 45px;
  }
  @media (max-width: 760px) {
    font-size: 24px;
  }
}

.section-scroller {
  &__inner {
    padding: 60px 0 60px;
    height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    @media (max-width: 1600px) {
      padding-top: 35px;
    }
    @media (max-width: 760px) {
      padding-bottom: 70px;
    }
  }
}

.header-item {
  font-family: 'Inter Bold';
  font-size: 90px;
  color: #C6F250;
  @media (max-width: 1600px) {
    font-size: 4.5vw;
  }
  @media (max-width: 1180px) {
    font-size: 42px;
  }
  @media (max-width: 760px) {
    font-size: 22px;
  }
}

.js-lottie-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  justify-content: center;
  @media (max-width: 1280px) {
    transform: scale(0.75);
  }
  // svg path {
  //   fill: #E838BB;
  // }
}

.future {
  font-family: 'Inter Bold';
  font-size: 106px;
}
</style>