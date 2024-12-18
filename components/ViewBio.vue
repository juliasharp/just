<script setup lang="ts">
import type { Color } from '../types/colors';
import { ColorEnum } from '../types/colors';

const props = defineProps({
  color: {
    type: String as PropType<Color>,
    default: ColorEnum.Acid,
    validator(value: ColorEnum) {
      return Object.values(ColorEnum).includes(value);
    }
  },
  text: {
    type: String,
    default: 'view bio',
  },
})
</script>

<template>
 <p class="view-bio" :class="color">{{ text }}</p>
</template>

<style lang="scss">
.view-bio {
  position: relative;
  color: #ffffff;
  width: fit-content;
  z-index: 0;
  font-family: 'calling code';
  font-size: 22px;
  text-transform: uppercase;
  &:after {
    content: '';
    position: absolute;
    width: calc(100% + 10px);
    height: 12px;
    left: -5px;
    z-index: -1;
    bottom: 1px;
    @media (max-width: 760px) {
      height: 11px;
    }
  }
  &.acid {
    &:after {
      background-color: #BDF412;
    }
  }
  &.blue {
    &:after {
      background-color: #0986A6;
    }
  }
  &.sage {
    &:after {
      background-color: #4A5827;
    }
  }
  &.purple {
    &:after {
      background-color: #400A82;
    }
  }
  &.pink {
    &:after {
      background-color: #FE15C0;
    }
  }
  &.brown {
    &:after {
      background-color: #A55027;
    }
  }
}
</style>