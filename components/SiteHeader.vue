<script setup lang="ts">
import gsap from 'gsap'
import LogoSVG from '/src/just-logo-res.svg?component'

const isOpen = ref(false)
const navRef = ref<HTMLElement | null>(null)
const isLogoHidden = ref(false)
let lastScrollY = 0
let currentBreakpoint = true // true = desktop
const HIDE_THRESHOLD = 3000

const showContactForm = useContactForm()
const heroReady = useHeroReady()
const route = useRoute()

const isConsultingPage = computed(() => route.path === '/')
const heroHidden = computed(() => isConsultingPage.value && !heroReady.value)

function handleScroll() {
  const current = window.scrollY || document.documentElement.scrollTop
  if (isOpen.value) {
    if (window.innerWidth >= 768) closeNav()
    lastScrollY = current
    return
  }
  const isScrollingDown = current > lastScrollY
  if (isScrollingDown && current > HIDE_THRESHOLD) {
    isLogoHidden.value = true
  } else {
    isLogoHidden.value = false
  }
  lastScrollY = current
}

function openNav() {
  isOpen.value = true
  isLogoHidden.value = false

  if (window.innerWidth < 768) {
    const links = navRef.value?.querySelectorAll('li') ?? []
    gsap.set(links, { opacity: 0, y: 24 })
    gsap.fromTo(navRef.value,
      { x: '100%' },
      { x: '0%', duration: 0.6, ease: 'power3.inOut' }
    )
    gsap.to(links, {
      opacity: 1, y: 0,
      duration: 0.45, stagger: 0.07, delay: 0.35, ease: 'power3.out',
    })
  } else {
    gsap.fromTo(navRef.value,
      { opacity: 0, x: 60 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }
    )
  }
}

function closeNav() {
  if (window.innerWidth < 768) {
    gsap.to(navRef.value, {
      x: '100%',
      duration: 0.5,
      ease: 'power3.inOut',
      onComplete: () => { isOpen.value = false },
    })
  } else {
    gsap.to(navRef.value, {
      opacity: 0,
      x: 60,
      duration: 0.35,
      ease: 'power3.in',
      onComplete: () => { isOpen.value = false },
    })
  }
}

function handleContact() {
  showContactForm.value = true
  closeNav()
}

function handleResize() {
  const isDesktop = window.innerWidth >= 768
  if (isDesktop === currentBreakpoint) return
  currentBreakpoint = isDesktop

  const links = navRef.value?.querySelectorAll('li') ?? []
  gsap.killTweensOf(navRef.value)
  gsap.killTweensOf(links)

  if (isOpen.value) isOpen.value = false

  gsap.set(navRef.value, { clearProps: 'all' })
  gsap.set(links, { clearProps: 'all' })

  // Restore desktop initial state (CSS handles mobile via transform)
  if (isDesktop) {
    gsap.set(navRef.value, { opacity: 0 })
  }
}

watch(() => route.path, () => {
  if (isOpen.value) closeNav()
})

onMounted(() => {
  currentBreakpoint = window.innerWidth >= 768
  lastScrollY = window.scrollY || 0
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <header class="site-header" :class="{ 'nav-is-open': isOpen }">
    <!-- Logo -->
    <div
      class="site-logo"
      :class="{ 'site-logo--hidden': isLogoHidden && !isOpen, 'site-logo--hero-hidden': heroHidden }"
    >
      <NuxtLink to="/" aria-label="JUST Design home">
        <LogoSVG />
      </NuxtLink>
    </div>

    <!-- Nav links (slides in from right, inline) -->
    <nav
      ref="navRef"
      class="site-nav"
      :class="{ 'is-open': isOpen }"
      aria-label="Main navigation"
    >
      <ul class="site-nav__links">
        <li>
          <NuxtLink to="/" class="nav-link" @click="closeNav">Consulting</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/residential" class="nav-link" @click="closeNav">Residential</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/emptychair" class="nav-link" @click="closeNav">Arts</NuxtLink>
        </li>
        <li>
          <button class="nav-link" @click="handleContact">Contact</button>
        </li>
      </ul>
    </nav>

    <!-- Hamburger → X (with nav-is-open for mobile blend-mode override) -->
    <button
      class="site-hamburger"
      :class="{ 'is-open': isOpen, 'site-hamburger--hero-hidden': heroHidden }"
      :aria-expanded="isOpen"
      :aria-label="isOpen ? 'Close navigation' : 'Open navigation'"
      @click="isOpen ? closeNav() : openNav()"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  </header>
</template>

<style lang="scss">
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  pointer-events: none;
  mix-blend-mode: difference;

  @media (min-width: 768px) {
    padding: 35px;
  }

  // Disable blend when mobile nav is open so the black overlay stays solid
  @media (max-width: 767px) {
    &.nav-is-open {
      mix-blend-mode: normal;
    }
  }
}

.site-logo {
  width: 88px;
  flex-shrink: 0;
  pointer-events: auto;
  transition: transform 0.35s ease, opacity 0.35s ease;
  z-index: 200;

  @media (min-width: 768px) {
    width: clamp(120px, 9vw, 160px);
  }

  a {
    display: block;
    color: #fff;
    animation: site-logo-in 0.6s ease 1.3s both;

    svg * {
      fill: currentColor;
    }
  }

  &--hidden {
    transform: translateY(-120%);
    opacity: 0 !important;
    pointer-events: none;
  }

  &--hero-hidden {
    opacity: 0 !important;
    pointer-events: none;
    transition: none;
  }
}

@keyframes site-logo-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .site-logo {
    animation: none;
    opacity: 1;
  }
}

.site-nav {
  flex: 1;
  display: flex;
  justify-content: center;
  opacity: 0;
  pointer-events: none;

  @media (max-width: 767px) {
    position: fixed;
    inset: 0;
    background: #000;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    padding: 80px 40px 40px;
    transform: translateX(100%);
    opacity: 1;
    z-index: 199;
    overflow-y: auto;
  }

  &.is-open {
    pointer-events: auto;
  }

  &__links {
    list-style: none;
    display: flex;
    align-items: center;
    gap: 32px;

    @media (min-width: 768px) {
      gap: 48px;
    }

    @media (max-width: 767px) {
      flex-direction: column;
      align-items: flex-end;
      gap: 36px;
    }
  }
}

.site-hamburger {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  pointer-events: auto;
  flex-shrink: 0;
  z-index: 200;

  span {
    display: block;
    width: 28px;
    height: 2px;
    background: #fff;
    transition: transform 0.35s ease, opacity 0.25s ease;

    @media (min-width: 768px) {
      width: 36px;
    }
  }

  &--hero-hidden {
    opacity: 0;
    pointer-events: none;
  }

  &.is-open {
    span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }
    span:nth-child(2) {
      opacity: 0;
    }
    span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }
  }
}

.nav-link {
  color: #fff;
  font-size: clamp(14px, 1.3vw, 18px);
  font-family: var(--body-font-medium);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  white-space: nowrap;

  @media (max-width: 767px) {
    font-size: 28px;
  }

  &.router-link-active {
    text-decoration: underline;
    text-underline-offset: 4px;
    @media (max-width: 767px) {
      text-underline-offset: 7px;
    }
  }
}
</style>
