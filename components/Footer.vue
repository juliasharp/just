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

const currentYear = computed(() => new Date().getFullYear());
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
  <div class="footer-bottom">
    <div class="footer-img">
      <!-- <NuxtImg src="/just-team.jpg" /> -->
    </div>
    <div class="footer-bottom-content">
      <!-- <p>THE FUTURE CAN BE JUST - DESIGN IT !</p> -->
      <hr class="footer-divider">
      <p class="copyright">copyright &copy; just {{ currentYear }}</p>
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
    z-index: 9;
    left: 50%;
    transform: translateX(-50%);
  }
}

.footer {
  position: relative;
  height: 100vh;
  &-container {
    flex-direction: column;
    justify-content: flex-end;
  }
  &-inner {
    align-items: flex-end;
    margin: 0 50px;
  }
  &-left {
    p {
      font-family: 'Inter Bold';
      font-size: 140px;
      @media (max-width: 1420px) {
        font-size: 105px;
      }
    }
  }
  &-right {
    margin-bottom: 25px;
    font-family: 'Calling Code';
    a {
      margin-right: 55px;
    }
  }
  &-divider {
    margin: 0 50px;
    border: 0.5px solid #cacaca;
  }
  &-bottom {
    position: relative;
    height: 100vh;
  }
}

.footer-img {
  position: relative;
  height: 100vh;
  background-image: url('/public/just-team.jpg');
  z-index: -1;
  position: relative;
  background-size: cover;
}

.copyright {
  margin: 0 50px;
  font-family: 'Inter Bold';
  text-transform: uppercase;
  font-size: 14px;
  padding: 14px 0;
  color: #ffffff;
}
</style>