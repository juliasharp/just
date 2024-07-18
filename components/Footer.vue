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
</script>

<template>
  <div class="footer">
    <div class="section-bg footer-container flex">
      <div class="flex space-between footer-inner">
        <div class="footer-left">
          <p>GET IN TOUCH</p>
        </div>
        <div class="footer-right flex">
          <NuxtLink to="https://www.instagram.com/__justdesign/">@_justdesign</NuxtLink>
          <a @click="showForm">CONTACT</a>
        </div>
      </div>
      
      <hr class="footer-divider">
      <p class="copyright">copyright just 2024</p>
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
    width: calc(100vw - 70px);
    height: 427px;
    position: absolute;
    top: -98px;
    z-index: 9;
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
      font-weight: 700;
      font-size: 140px;
    }
  }
  &-right {
    margin-bottom: 25px;
    font-weight: 700;
    a {
      margin-right: 55px;
    }
  }
  &-divider {
    margin: 0 50px;
    border: 0.5px solid #707070;
  }
}

.copyright {
  margin: 0 50px;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 16px;
  padding: 14px 0;
}
</style>