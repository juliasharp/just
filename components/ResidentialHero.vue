<script setup lang="ts">

import gsap from 'gsap';

const config = useRuntimeConfig();
const query = `
  query NewQuery {
    page(id: "234", idType: DATABASE_ID) {
      residentialLp {
        heroImage {
          node {
            altText
            sourceUrl
          }
        }
        heroImageLayerBottom {
          node {
            altText
            sourceUrl
          }
        }
        heroImageLayerTop {
          node {
            altText
            sourceUrl
          }
        }
      }
    }
  }
`;

const { data, error } = await useFetch(config.public.wordpressUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: {
    query
  },
  transform: (d: any) => {
    const lp = d?.data?.page?.residentialLp
    return {
      hero: lp?.heroImage?.node || null,
      o1: lp?.heroImageLayerTop?.node || null,
      o2: lp?.heroImageLayerBottom?.node || null,
    }
  }
})

if (error.value) console.error('Error fetching residential hero data:', error.value);

// --- Refs for layout/animation ---
const root = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const slide = ref<HTMLElement | null>(null)       // big image + overlays (moves as a group)
const intro = ref<HTMLElement | null>(null)       // intro text (shows first, then hides)
const staticPane = ref<HTMLElement | null>(null)  // revealed left text
const o1Ref = ref<HTMLElement | null>(null)       // top overlay
const o2Ref = ref<HTMLElement | null>(null)       // bottom overlay
let tl: gsap.core.Timeline | null = null

const isReady = ref(false); // false on SSR -> hides overlays/intro/aside

function onHeroLoaded() {
  // If the hero image is already cached, this will run immediately.
  requestAnimationFrame(() => {
    runAnimation();
    isReady.value = true; // remove inert state AFTER GSAP has set initial states
  });
}

function computeGap() {
  if (!root.value || !staticPane.value) return 0
  return staticPane.value.offsetWidth
}

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function runAnimation() {
  if (!stage.value || !slide.value || !intro.value || !staticPane.value) return

  const isMobile = window.matchMedia('(max-width: 767.98px)').matches
  const gap = computeGap()

  // Reduced motion → jump to end
  if (prefersReduced) {
    gsap.set(intro.value, { autoAlpha: 0 })
    gsap.set(staticPane.value, { autoAlpha: 1 })
    if (!isMobile) gsap.set(slide.value, { x: gap })
    if (o1Ref.value) gsap.set(o1Ref.value, { autoAlpha: 1, y: 0 })
    if (o2Ref.value) gsap.set(o2Ref.value, { autoAlpha: 1, y: 0 })
    return
  }

  tl?.kill()
  tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  // Initial states
  gsap.set([stage.value, slide.value, staticPane.value, intro.value], { willChange: 'transform, opacity' })
  gsap.set(staticPane.value, { autoAlpha: 0 })
  gsap.set(intro.value, { autoAlpha: 0, y: 16 })
  if (o1Ref.value) gsap.set(o1Ref.value, { autoAlpha: 0, y: 12 })
  if (o2Ref.value) gsap.set(o2Ref.value, { autoAlpha: 0, y: 12 })

  // 1) Stage fade in (hero visible)
  tl.fromTo(stage.value, { autoAlpha: 0, scale: 1.02 }, { autoAlpha: 1, scale: 1, duration: 0.6 })

  // 2) Intro in → hold → out (mobile & desktop)
  tl.to(intro.value, { autoAlpha: 1, y: 0, duration: 0.45 }, '-=0.1')
    .to({}, { duration: 1.6 })
    .to(intro.value, { autoAlpha: 0, y: 8, duration: 0.35 })

  // 3) Reveal text pane
  tl.to(staticPane.value, { autoAlpha: 1, duration: 0.35 }, '-=0.1')

  // 4) Desktop: slide the hero to target width; Mobile: no width change
  if (!isMobile) {
    const isLg = window.matchMedia('(min-width: 1280px)').matches
    const targetWidth = isLg ? '50vw' : `calc(100vw - ${gap}px)`
    tl.to(slide.value, { width: targetWidth, duration: 0.9, ease: 'power4.out' }, '<')
  } else {
    gsap.set(slide.value, { clearProps: 'width,x' }) // keep CSS-driven full width, 262px tall
  }

  // 5) Overlays in
  tl.add(() => {
    if (o1Ref.value) gsap.to(o1Ref.value, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out' })
    if (o2Ref.value) gsap.to(o2Ref.value, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 0.4 })
  })
}

function handleResize() {
  if (!slide.value || !staticPane.value) return
  const isMobile = window.matchMedia('(max-width: 767.98px)').matches
  if (isMobile) {
    gsap.set(slide.value, { clearProps: 'width,x' })
    return
  }
  const gap = computeGap()
  //const targetWidth = `calc(100vw - ${gap}px)`
  const targetWidth = `50%`
  gsap.set(slide.value, { width: targetWidth })
}

onMounted(() => {
  const heroEl = slide.value?.querySelector('img[data-role="hero"]') as HTMLImageElement | null;
  if (heroEl?.complete) onHeroLoaded();

  window.addEventListener('resize', handleResize, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  tl?.kill()
})
</script>

<template>
  <section 
    ref="root" 
    :class="[
      'hero-section relative h-auto md:h-[100dvh] overflow-hidden', 
      { 'hero--inert': !isReady }
    ]"
  >
    <!-- Left static text pane (revealed after intro) -->
    <aside
      ref="staticPane"
      data-static
      class="
        pb-[15px] res-gutter pointer-events-none 
        relative
        md:absolute md:left-0 md:bottom-0 md:h-[50vh] md:w-[min(39vw,580px)] 
        flex flex-col justify-end"
    >
      <div>
        <p class="hero-text body-font-medium">
          <span class="body-font-bold">JUST Design</span> is a minority-owned architecture and design studio specializing in thoughtful, modern residential homes that balance form, function, and feeling.
        </p>
      </div>
      <div class="scroll-text body-font-medium">
        <p>scroll for more</p>
      </div>
    </aside>

    <!-- The group that slides to the right (big hero + overlays) -->
    <div 
      ref="stage"
      class="relative w-full h-[262px] md:absolute md:top-0 md:right-0 md:h-full md:w-screen">
      <div 
        ref="slide" 
        data-slide 
        class="
          relative w-full h-[262px]
          md:absolute md:top-0 md:right-0 md:h-full md:w-screen">
        <!-- Big hero image -->
        <img
          v-if="data?.hero"
          data-role="hero"
          :src="data.hero.sourceUrl"
          :alt="data.hero.altText || ''"
          class="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
          @load="onHeroLoaded"
        />

        <!-- Overlay image #1 (TOP) — appears after slide -->
        <img
          v-if="data?.o1"
          ref="o1Ref"
          data-overlay
          :src="data.o1.sourceUrl"
          :alt="data.o1.altText || ''"
          class="
            absolute z-10 max-w-none
            w-[62vw] top-[67px] right-[-13vw]
            md:w-[min(37vw,545px)] md:top-[6vh] md:right-[unset] md:left-[-10%]"
          loading="eager"
          decoding="async"
        />

        <!-- Overlay image #2 (BOTTOM) — appears after slide, slightly later -->
        <img
          v-if="data?.o2"
          ref="o2Ref"
          data-overlay
          :src="data.o2.sourceUrl"
          :alt="data.o2.altText || ''"
          class="
            absolute z-20 max-w-none 
            w-[42vw] bottom-[-37vw] left-[17vw]
            md:w-[min(22vw,330px)] md:bottom-[6vh] md:left-[53%]"
        />
      </div>

      <!-- Intro text that shows first, then disappears -->
      <div
        ref="intro"
        data-intro
        class="hero-text-initial absolute inset-0 z-30 flex items-end pb-[35px] px-6 md:px-10"
      >
        <div class="w-full md:flex justify-between">
          <p class="body-font-bold">a JUST home is</p>
          <p>built with care, dignity, and transparency.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.hero--inert [data-intro],
.hero--inert [data-static],
.hero--inert [data-overlay] {
  opacity: 0;
  visibility: hidden;
}

.hero--inert [data-slide] {
  opacity: 1;
  visibility: visible;
}

.hero {
  &-section {
    @media (max-width: 767px) {
      display: flex;
      flex-direction: column-reverse;
      justify-content: space-between;
      margin-top: 77px;
      height: calc(100dvh - 78px);
    }
  }
  &-text {
    font-size: clamp(20px, 2.4vw, 36px);
    line-height: 1.28;
    &-initial {
      color: #fff;
      font-size: clamp(20px, 2.5vw, 41px);
    }
  }
}

img { image-rendering: auto; }

.scroll-text {
  display: block;
  margin-top: 9vh;
  @media (min-width: 768px) {
    margin-top: 15vh;
  }
  p {
    padding-left: 20px;
    position: relative;
    font-size: 20px;
      @media (max-width: 767px) {
      font-size: 18px;
    }
    &:before {
      content: '';
      width: 8px;
      height: 8px;
      background: #000000;
      border-radius: 50%;
      position: absolute;
      left: 1px;
      top: 11px;
      @media (min-width: 768px) {
        width: 10px;
        height: 10px;
      }
    }
  }
}
</style>