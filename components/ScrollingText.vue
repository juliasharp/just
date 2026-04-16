<script setup lang="ts">
const props = defineProps<{
  text: string
  secondsPerChar?: number
}>()

const copies = Array(5).fill(null)

// Duration scales with text length so visual speed stays constant across different text lengths.
// secondsPerChar is tuned to match the header scrolling speed at its default text length.
const duration = computed(() => props.text.length * (props.secondsPerChar ?? 1.33))
</script>

<template>
  <div class="marquee" :aria-label="text">
    <div class="marquee__track scrolling-text body-font-code" :style="{ animationDuration: `${duration}s` }">
      <span v-for="(_, i) in copies" :key="i" class="marquee__item">{{ text }}</span>
      <span v-for="(_, i) in copies" :key="`d${i}`" class="marquee__item" aria-hidden="true">{{ text }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scrolling-text {
  font-size: 1.125rem;
  @media (min-width: 768px) {
    font-size: 1.625rem;
  }
  color: var(--accent-color-yellow);
}

.marquee {
  overflow: hidden;
  width: 100%;
  white-space: nowrap;
}

.marquee__track {
  display: inline-flex;
  min-width: 200%;
  animation: marquee-scroll linear infinite;
}

.marquee__item {
  flex-shrink: 0;
  padding-right: 1em;

  &::after {
    content: '·';
    margin-left: 1em;
  }
}

@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
</style>
