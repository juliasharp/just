<script setup lang="ts">
import { gsap } from 'gsap';
import lottie from 'lottie-web';
import ACDAnimation from '@/assets/NEW-ACD.json';

const textContainer = ref(null);

const lottieContainer = ref(null);
const currentText = ref('');
const currentHeader = ref('');
const currentTextHeader = ref('');
const displayedHeaders = ref([]); // Updated to hold multiple headers
const headers = ['+ ACT ', '+ COLLABORATE ', '+ DESIGN', '= EQUITABLE FUTURE NOW'];
const dataHeaders = ['DETERMINE YOUR ACTION', 'BUILD YOUR TEAM', 'CREATE AND REALIZE', 'EMPOWER AND THRIVE'];
const data = [
  `<p><span style="font-family: 'Inter Bold'">JUST Act</span> is your opportunity to envision and plan the actions we will take together in designing your project. <br /> <span style="display:block; padding-top:10px;"><span style="font-family: 'Inter Bold'">JUST Act</span> is also our non-profit equity engine, partnering to build the just legacy you want to see in the world!</span></p>`, 
  `JUST is your access to engage diverse expertise and perspectives to inform and guide your project. Drawing on decades of experience from designers, creatives, subject matter experts, leaders, and activists, <span style="font-family: 'Inter Bold'">JUST Collaborate</span> is your platform to imagine, innovate, and implement!`, 
  `With a project specific approach, <span style="font-family: 'Inter Bold'">JUST Design</span> will integrate our expertise in creating and guiding equitable processes to work with you to develop your project through key phases of design, and bring it to life!`,
  `By uniting Act, Collaborate, and Design, we shape transformative solutions that support your needs and inspire just and healthy change - enabling you to <span style="font-style: italic">live your future <span style="font-weight: bold;">now</span></span>.`
];
const currentIndex = ref(0);

const handleTextChange = (index) => {
  if (index >= data.length || index === currentIndex.value) return;
  
  const textElement = textContainer.value;
  const newText = data[index];
  const newTextHeader = dataHeaders[index];
  //const newHeader = headers.slice(0, index + 1).join('  +  ');

  displayedHeaders.value = headers.slice(0, index + 1);
  
  gsap.to(textElement, {
    opacity: 0,
    duration: 0.2,
    onComplete: () => {
      currentText.value = newText;
      //currentHeader.value = newHeader;
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
  displayedHeaders.value = [headers[0]];
  //currentHeader.value = headers[0];
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
          <div class="evergreen__visual">
            <div class="js-lottie-container" ref="lottieContainer"></div>
          </div>
          <div class="section-scroller__header">
            <div class="header-item">
              <div v-for="(header, index) in displayedHeaders" :key="index" class="header-line">
                {{ header }}
              </div>
            </div>
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
      padding: 85px 20px 100px;
    }
  }
  &__visual {
    position: absolute;
    width: 100%;
    height: 100%;
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
    height: 145px;
    @media (max-width: 1600px) {
      font-size: 30px;
    } 
    @media (max-width: 1480px) {
      font-size: 25px;
      height: 125px;
    }
    @media (max-width: 1280px) {
      font-size: 25px;
      height: 145px;
    }
    @media (max-width: 1000px) {
      font-size: 22px;
      height: 130px;
    }
    @media (max-width: 800px) {
      font-size: 20px;
      height: 110px;
    }
    @media (max-width: 767px) {
      font-size: 18px;
    }
    @media (max-width: 450px) {
      height: 175px;
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
        padding-bottom: 12px;
      }
      @media (max-width: 1480px) {
        font-size: 32px;
      }
      @media (max-width: 900px) {
        font-size: 28px;
        padding-bottom: 5px;
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
  &__header {
    padding-top: 100px;
    @media (max-width: 1600px) {
      padding-top: 50px;
    }
    @media (max-width: 1280px) {
      padding-top: 60px;
    }
    @media (max-width: 900px) {
      padding-top: 32px;
    }
  }
  &__inner {
    padding-bottom: 60px;
    height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    @media (max-width: 1600px) {
      padding-bottom: 50px;
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
    font-size: 3.7vw;
  }
  @media (max-width: 1180px) {
    font-size: 36px;
  }
  @media (max-width: 760px) {
    font-size: 22px;
  }
  @media (max-width: 450px) {
    font-size: 26px;
  }
}

.header-line {
  &:not(:last-of-type) {
    color: #C6F25080;
  }
  &:nth-of-type(4) {
    padding-top: 20px;
    width: max-content;
    @media (max-width: 450px) {
      width: unset;
    }
    &:before {
      content: '';
      width: 100%;
      height: 4px;
      background-color:#C6F250;
      top: 10px;
      position: absolute;
    }
  }
}

.js-lottie-container {
  position: absolute;
  right: 0;
  top: -10px;
  width: 525px;
  height: 525px;
  @media (max-width: 1600px) {
    top: -75px;
  }
  @media (max-width: 1280px) {
    transform: scale(0.75);
    top: -50px;
    right: -55px;
  }
  @media (max-width: 1000px) {
    right: -120px;
  }
  @media (max-width: 900px) {
    right: 50%;
    top: 12%;
    transform: translateX(50%) scale(0.6);
  }
  @media (max-width: 450px) {
    transform: translateX(50%) scale(0.4);
    top: 4%;
  }
  svg {
    height: auto !important;
    width: auto !important;
  }
}

.future {
  font-family: 'Inter Bold';
  font-size: 106px;
}
</style>