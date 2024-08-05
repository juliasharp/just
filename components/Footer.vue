<script setup lang="ts">
const props = defineProps({
	showForm: {
		type: Boolean,
		default: false
	}
});

const emit = defineEmits<{
  (e: 'update:showForm', value: boolean): void;
}>();

const isShown = computed({
  get() {
    return props.showForm;
  },
  set(value: boolean) {
    emit('update:showForm', value);
  }
});

function showForm() {
  isShown.value = true;
}

const initAnimations = () => {
  gsap.timeline({
    scrollTrigger: {
      trigger: '.footer-container',
      start: 'top top',
      end: 'bottom top',
      pin: true,
      pinSpacing: true,
      scrub: 0.2,
      markers: true
    }
  })
}

// onMounted(() => {
//   initAnimations();
// });
</script>

<template>
  <div class="footer">
    <div class="section-bg footer-container flex">
      <div class="flex space-between footer-inner">
        <div class="footer-left">
          <p>GET IN TOUCH</p>
        </div>
        <div class="footer-right flex">
          <NuxtLink to="https://www.instagram.com/__justdesign/">@__justdesign</NuxtLink>
          <a @click="showForm">CONTACT</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.section-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url('/src/yellow-grain.jpg');
  &:before {
    content: '';
    display: block;
    background: url('/src/logo.svg') no-repeat;
    width: 100%;
    // max-width: 1345px;
    height: 100%;
    position: absolute;
    top: -134px;
    z-index: 0;
    left: 50%;
    transform: translateX(-50%);
    @media (max-width: 760px) {
      top: -48px;
    }
  }
}

.footer {
  height: 100vh;
  &-container {
    flex-direction: column;
    justify-content: flex-end;
  }
  &-inner {
    align-items: flex-end;
    margin: 0 50px;
    @media (max-width: 760px) {
      margin: 0 20px;
    }
  }
  &-left {
    p {
      font-family: 'Inter Bold';
      font-size: 140px;
      @media (max-width: 1420px) {
        font-size: 105px;
      }
      @media (max-width: 1280px) {
        font-size: 7.46vw;
      }
    }
  }
  &-right {
    margin-bottom: 25px;
    font-family: 'Calling Code';
    a {
      margin-right: 55px;
      @media (max-width: 760px) {
        margin-right: 30px;
      }
    }
  }
}
</style>