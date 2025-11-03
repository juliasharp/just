<script setup lang="ts">
import LinkedinSVG from '/src/linkedin.svg?component';
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

</script>

<template>
  <div class="footer">
    <div class="section-bg footer-container flex">
      <div class="noise">
        <div class="flex space-between footer-inner">
          <div class="footer-left">
            <p>GET IN TOUCH</p>
          </div>
          <div class="footer-right flex">
            <NuxtLink to="https://www.instagram.com/__justdesign/" target="_blank">@__justdesign</NuxtLink>
            <NuxtLink to="https://www.linkedin.com/company/just-design-inc/" target="_blank"><LinkedinSVG class="linkedin" /></NuxtLink>
            <a @click="showForm">CONTACT</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.section-bg {
  // position: absolute;
  // width: 100%;
  height: 100%;
  //background: url('/src/yellow-grain.jpg');
  background: #c6f250;
  &:before {
    content: '';
    display: block;
    background: url('/src/footer-logo.svg') no-repeat;
    width: 100%;
    // max-width: 1345px;
    height: 100%;
    position: absolute;
    top: -1px;
    z-index: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  &:after {
    content: '';
    background: url('/src/just-footer-arrow.svg') no-repeat;
    width: 100%;
    height: 27.3vh;
    display: block;
    position: absolute;
    bottom: 183px;
    left: 50%;
    @media (max-width: 1480px) {
      bottom: 145px;
      height: 23vh;
    }
    @media (max-width: 1280px) {
      height: 20vh;
      bottom: 135px;
      left: 30%;
    }
    @media (max-width: 760px) {
      display: none;
    }
  }
}

.footer {
  height: 100vh;
  @media (max-width: 767px) {
    height: 400px;
  }
  &-container {
    flex-direction: column;
    justify-content: flex-end;
  }
  &-inner {
    align-items: flex-end;
    margin: 0 50px;
    height: 100%;
    z-index: 9;
    @media (max-width: 1280px) {
      margin: 0 20px;
    }
    @media (max-width: 760px) {
      flex-direction: column;
      justify-content: end;
      align-items: flex-start;
    }
  }
  &-left {
    @media (max-width: 1280px) {
      padding-bottom: 10px;
    }
    @media (max-width: 760px) {
      margin-bottom: 20px;
    }
    p {
      font-family: 'Inter Bold';
      font-size: 8.5vw;
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
      position: relative;
      width: fit-content;
      @media (max-width: 1280px) {
        margin-right: 35px;
      }
      @media (max-width: 760px) {
        margin-right: 30px;
      }
      &:last-of-type {
        margin-right: 0;
      }
      &:after {
        transform: scaleX(0);
        transform-origin: bottom left;
        transition: transform 0.6s ease;
        content: "";
        width: calc(100% + 10px);
        height: 3px;
        position: absolute;
        bottom: -4px;
        left: -5px;
        z-index: 8;
        background: #E838BB;
      }
      &:hover {
        &:after {
          transform: scaleX(1);
          transition: ease 0.3s all;
          transition-delay: 0.2s;
        }
      }
    }
  }
}

.linkedin {
  width: 15px;
  height: 17px;
}

.noise {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  &:after {
    position: absolute;
    top: -10rem;
    left: -10rem;
    width: calc(100% + 20rem);
    height: calc(100% + 20rem);
    animation: noise 1s steps(2) infinite;
    background-image: url('/public/noise.png');
    background-position: 50%;
    content: '';
    will-change: transform;
  }
}
</style>