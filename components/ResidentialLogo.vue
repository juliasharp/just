<script setup lang="ts">
import gsap from 'gsap'
import LogoSVG from '/src/just-logo-res.svg?component'

const logoRef = ref<HTMLElement | null>(null)
const isLogoHidden = ref(false)
let lastScrollY = 0
const HIDE_THRESHOLD = 3000

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function handleScroll() {
  const current = window.scrollY || document.documentElement.scrollTop
  const isScrollingDown = current > lastScrollY
  if (isScrollingDown && current > HIDE_THRESHOLD) {
    isLogoHidden.value = true
  } else {
    isLogoHidden.value = false
  }
  lastScrollY = current
}

onMounted(() => {
  lastScrollY = window.scrollY || 0
  window.addEventListener('scroll', handleScroll, { passive: true })

  if (!prefersReduced && logoRef.value) {
    gsap.set(logoRef.value, { autoAlpha: 0 })
    gsap.to(logoRef.value, {
      autoAlpha: 1,
      duration: 0.6,
      delay: 1.3,
      ease: 'power3.out',
    })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="res-logo-header">
    <div ref="logoRef" class="logo" :class="{ 'logo--hidden': isLogoHidden }">
      <LogoSVG />
    </div>
  </header>
</template>

<style lang="scss">
.res-logo-header {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 99;
  display: flex;
  pointer-events: none;

  @media (min-width: 768px) {
    top: 35px;
    left: 35px;
    mix-blend-mode: difference;
  }
}

.logo {
  color: #fff;
  width: 88px;
  pointer-events: auto;
  transition:
    transform 0.35s ease,
    opacity 0.35s ease;

  @media (min-width: 768px) {
    width: clamp(120px, 9vw, 160px);
  }

  svg * {
    fill: currentColor;
  }

  &.logo--hidden {
    transform: translateY(-120%) !important;
    opacity: 0 !important;
    pointer-events: none;
  }
}
</style>
