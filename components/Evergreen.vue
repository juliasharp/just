<script setup lang="ts">
import { gsap } from 'gsap';
import lottie from 'lottie-web';
import ACDAnimation from '@/assets/ACD-animation.json';

const textContainer = ref(null);

const lottieContainer = ref(null);
const currentText = ref('');
const currentHeader = ref('');
const currentTextHeader = ref('');
const headers = ['ACT', 'COLLABORATE', 'DESIGN'];
const dataHeaders = ['DETERMINE YOUR ACTION', 'BUILD YOUR TEAM', 'CREATE AND REALIZE'];
const data = [
  `<p><span style="font-family: 'Inter-Bold'">JUST Act</span> is your opportunity to envision and plan the actions we will take together in designing your project.</p><p style='padding-top:20px;'><span style="font-family: 'Inter-Bold'">JUST Act</span> is also our non-profit equity engine, partnering to build the just legacy you want to see in the world!</p>`, 
  `JUST is your access to engage diverse expertise and perspectives to inform and guide your project. Drawing on decades of experience from designers, creatives, subject matter experts, leaders, and activists, <span style="font-family: 'Inter-Bold'">JUST Collaborate</span> is your platform to imagine, innovate, and implement!`, 
  `With a project specific approach, <span style="font-family: 'Inter-Bold'">JUST Design</span> will integrate our expertise in creating and guiding equitable processes to work with you to develop your project through key phases of design, and bring it to life!`,
  `<span style="font-size:4.68vw; font-family:'Inter Bold';display:flex;justify-content:center;">EQUITABLE FUTURE<span>`
];
const currentIndex = ref(0);

const handleTextChange = (index) => {
  if (index >= data.length || index === currentIndex.value) return;
  
  const textElement = textContainer.value;
  const newText = data[index];
  const newTextHeader = dataHeaders[index];
  const newHeader = headers.slice(0, index + 1).join(' + ');
  
  //gsap.set(textElement, { height: textElement.offsetHeight });
  
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
  
//   headers.value.forEach((_, headerIndex) => {
//     const headerElement = textContainer.value.parentNode.children[headerIndex];
//     if (headerIndex === index) {
//       gsap.to(headerElement, { opacity: 1, y: '0%' });
//     } else {
//       gsap.to(headerElement, { opacity: 0, y: '10%' });
//     }
//   });

//   gsap.fromTo(
//     textContainer.value.parentNode.children[index],
//     { opacity: 0, y: '10%' },
//     { opacity: 1, y: '0%' }
//   );
  
//   currentIndex.value = index;
// };

const initAnimations = () => {
  //gsap.registerPlugin(ScrollTrigger);

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
      markers: true,
      onUpdate: (self) => {
        const segmentIndex = Math.floor(self.progress / (1 / data.length));
        handleTextChange(segmentIndex);
        lottieInstance.goToAndStop(lottieInstance.totalFrames * self.progress, true);
      }
    }
  });

  // lottieInstance.addEventListener('DOMLoaded', () => {
  //   gsap.timeline({
  //     scrollTrigger: {
  //       trigger: '.js-section-scroller' + top,
  //       end: window.innerHeight * (data.length) + ' top',
  //       scrub: 0.2
  //     }
  //   }).to(lottieInstance, {
  //     frame: lottieInstance.totalFrames - 1,
  //     //remove blob when animation is over.
  //     onUpdate: () => lottieInstance.goToAndStop(lottieInstance.frame, true)
  //   });
  // });
};

onMounted(() => {
  //Initialize first state
  currentText.value = data[0];
  currentHeader.value = headers[0];
  currentTextHeader.value = dataHeaders[0];
  initAnimations();
});

onBeforeUnmount(() => {
  gsap.killTweensOf(textContainer.value);
  //gsap.killTweensOf(headers.value);
});
</script>

<template>
<div class="evergreen">
  <div class="section-bg">
    <div class="evergreen-inner">
      <!-- <h2>JUST is a creative agency of activists and experts, designing equitable futures NOW !</h2> -->
      <div class="section-scroller js-section-scroller">
        <!--<script id="section-scroller-data">-->
         <div class="section-scroller__inner">
          <div class="section-scroller__header">
            <div class="header-item" :ref="'headerContainer'">
              {{ currentHeader }}
            </div>
          </div>
          <div class="evergreen__visual">
            <div class="js-lottie-container" ref="lottieContainer"></div>
          </div>
          <div class="evergreen__footer">
            <div class="evergreen-textHeader" ref="textHeader">{{ currentTextHeader }}</div>
            <div class="evergreen-text" ref="textContainer" v-html="currentText"></div>
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
      padding: 65px 20px;
    }
  }
  &__footer {
    display: flex;
    flex-direction: column;
    justify-content: end;
  }
  &-text {
    color: #C6F250;
    font-size: 44px;
    line-height: 1.2;
    @media (max-width: 1480px) {
      font-size: 34px;
    } 
    @media (max-width: 760px) {
      font-size: 20px;
    }
    span {
      font-family: 'Inter Bold';
    }
    &Header {
      font-family: 'Calling Code';
      font-size: 28px;
      padding-bottom: 12px;
      color: #C6F250;
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
    padding: 60px 0 48px;
    height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    @media (max-width: 1600px) {
      padding-top: 35px;
    }
  }
  &__header {
    display: flex;
    justify-content: center;
  }
}

.header-item {
  font-family: 'Inter Bold';
  font-size: 4.68vw;
  color: #C6F250;
  // @media (max-width: 1600px) {
  //   font-size: 78px;
  // }
  // @media (max-width: 1380px) {
  //   font-size: 65px;
  // }
  @media (max-width: 1180px) {
    font-size: 55px;
  }
  @media (max-width: 760px) {
    font-size: 28px;
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
  // svg path {
  //   fill: #E838BB;
  // }
}

.future {
  font-family: 'Inter Bold';
  font-size: 106px;
}
</style>