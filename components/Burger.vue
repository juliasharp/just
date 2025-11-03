<script setup lang="ts">

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

// const emit = defineEmits<{
//   (e: 'update:modelValue', value: Boolean): void;
// }>();
</script>

<template>
  <div :class="isOpen ? 'is-open' : ''" class="Burger">
    <div class="Burger-open posFit">
      <span class="Burger-openBar"></span>
      <span class="Burger-openBar"></span>
      <span class="Burger-openBar"></span>
    </div>
    <div class="Burger-close posFit">
      <span class="Burger-closeBar"></span>
      <span class="Burger-closeBar"></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.Burger {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  &-openBar,
  &-closeBar {
    display: block;
    width: 100%;
    height: 2px;
    background-color: #333;
  }
  &-open {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &Bar {
      transition: transform .5s cubic-bezier(.77,0,.175,1);
      transform-origin: 0 50%;
      &:first-of-type {
        transition-delay: .5s;
      }
      &:nth-child(2) {
        transition-delay: .6s;
      }
      &:nth-child(3) {
        transition-delay: .7s;
      }
    }
  }
  &-close {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transform: translateY(3px) rotate(-90deg);
    height: 100%;
    &Bar {
      transition: transform .5s cubic-bezier(.77,0,.175,1);
      transform-origin: 100% 50%;
      &:first-child {
        transform: rotate(-45deg) scaleX(0);
        transition-delay: 0s;
      }
      &:nth-child(2) {
        transform: rotate(45deg) scaleX(0);
        transition-delay: .1s;
      }
    }
  }
  &.is-open {
    .Burger-openBar {
      transform: scaleX(0);
      &:first-child {
        transition-delay: 0s;
      }
    }
    .Burger-closeBar {
      background-color: #fff;
      &:first-child {
        transform: rotate(-45deg) scaleX(1);
        transition-delay: .5s;
      }
      &:nth-child(2) {
        transform: rotate(45deg) scaleX(1);
        transition-delay: .6s;
      }
    }
  }
}
</style>