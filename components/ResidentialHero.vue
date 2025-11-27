<script setup lang="ts">
import gsap from 'gsap'
import LogoSVG from '/src/just-logo-res.svg?component';
import ScrollTrigger from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const config = useRuntimeConfig()
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
`

const { data, error } = await useFetch(config.public.wordpressUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: { query },
  transform: (d: any) => {
    const lp = d?.data?.page?.residentialLp
    return {
      hero: lp?.heroImage?.node || null,
      o1: lp?.heroImageLayerTop?.node || null,
      o2: lp?.heroImageLayerBottom?.node || null,
    }
  }
})

if (error.value) console.error('Error fetching residential hero data:', error.value)

// --- Refs for layout/animation ---
const root = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)       // full-height hero image section
const slide = ref<HTMLElement | null>(null)       // big image wrapper (no longer slides)
const intro = ref<HTMLElement | null>(null)       // intro text overlay
const staticPane = ref<HTMLElement | null>(null)  // second section (hero text + overlays)
const o1Ref = ref<HTMLElement | null>(null)       // overlay image #1
const o2Ref = ref<HTMLElement | null>(null)       // overlay image #2
const heroLeft = ref<HTMLElement | null>(null)
const heroImg = ref<HTMLImageElement | null>(null)


let tl: gsap.core.Timeline | null = null

const isReady = ref(false) // hide intro / static / overlays until animation sets them
let section2Trigger: ScrollTrigger | null = null

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const isDesktop =
  typeof window !== 'undefined'
    ? window.matchMedia?.('(min-width: 768px)').matches
    : true // SSR fallback

function onHeroLoaded() {
  requestAnimationFrame(() => {
    runAnimation()
    isReady.value = true
  })
}

function lockScroll() {
  if (typeof document === 'undefined') return
  document.documentElement.classList.add('is-locked')
  document.body.classList.add('is-locked')
}

function unlockScroll() {
  if (typeof document === 'undefined') return
  document.documentElement.classList.remove('is-locked')
  document.body.classList.remove('is-locked')
}

function runAnimation() {
  if (!stage.value || !intro.value || !heroImg.value) return

  tl?.kill()
  tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  if (prefersReduced) {
    gsap.set(stage.value, { autoAlpha: 1, scale: 1 })
    gsap.set(heroImg.value, { autoAlpha: 1, scale: 1 })
    gsap.set(intro.value, { autoAlpha: 1, y: 0 }) // keep visible
    return
  }

  // Make sure these elements are ready for animation
  gsap.set([stage.value, slide.value, intro.value, heroImg.value], {
    willChange: 'transform, opacity',
  })

  // initial state: hero hidden, text hidden
  gsap.set(heroImg.value, { autoAlpha: 0, scale: 1.02 })
  gsap.set(intro.value, { autoAlpha: 0, y: 16 })

  // 1) HERO PHOTO fades in from beige bg
  tl.to(heroImg.value, {
    autoAlpha: 1,
    scale: 1,
    duration: 2.5,
  })

  // 2) Intro text in and stay (same vibe as before)
  tl.to(
    intro.value,
    { autoAlpha: 1, y: 0, duration: 0.45 },
    '-=0.15' // slightly overlap so it feels connected
  )
}

function setupSection2ScrollTrigger() {
  if (!staticPane.value) return

  // Reduced motion: just show everything, no lock, no animation
  if (prefersReduced || !isDesktop) {
    gsap.set(staticPane.value, { autoAlpha: 1, y: 0 })
    if (o2Ref.value) gsap.set(o2Ref.value, { autoAlpha: 1, y: 0, scale: 1 })
    if (o1Ref.value) gsap.set(o1Ref.value, { autoAlpha: 1, y: 0, scale: 1 })
    if (heroLeft.value) gsap.set(heroLeft.value, { autoAlpha: 1, y: 0 })
    return
  }

  // Initial hidden states for section 2 elements
  gsap.set(staticPane.value, { autoAlpha: 0, y: 24 })

  if (o2Ref.value) {
    gsap.set(o2Ref.value, {
      autoAlpha: 0,
      y: 24,
      scale: 1.02, // match hero starting scale
    })
  }

  if (o1Ref.value) {
    gsap.set(o1Ref.value, {
      autoAlpha: 0,
      y: 24,
      scale: 1.02, // match hero starting scale
    })
  }

  if (heroLeft.value) {
    gsap.set(heroLeft.value, { autoAlpha: 0, y: 24 })
  }

  // Timeline for section 2 (plays once when triggered)
  const tl2 = gsap.timeline({
    paused: true,
    defaults: { ease: 'power3.out' },
    onComplete() {
      // when stagger is done, unlock scroll and kill lock trigger
      unlockScroll()
      section2Trigger?.kill()
      section2Trigger = null
    },
  })

  // Fade in whole section wrapper
  tl2.to(staticPane.value, { autoAlpha: 1, y: 0, duration: 0.9 }, 0)

  // 1) bottom image first (o2) – fade + scale match hero
  if (o2Ref.value) {
    tl2.to(
      o2Ref.value,
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,    // match hero end scale
        duration: 2, // match hero fade duration
      },
      0.1
    )
  }

  // 2) then top image (o1) – starts partway through o2
  if (o1Ref.value) {
    tl2.to(
      o1Ref.value,
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 2, // same feel as hero
      },
      '-=1.2'        // overlap so they feel connected, tweak as desired
    )
  }

  // 3) then text block
  if (heroLeft.value) {
    tl2.to(
      heroLeft.value,
      { autoAlpha: 1, y: 0, duration: 0.75 },
      '-=0.4'
    )
  }

  // tiny hold at the end
  tl2.to({}, { duration: 0.7 })

  // --- Trigger 1: start animation early (top 70%) ---
  ScrollTrigger.create({
    trigger: staticPane.value,
    start: 'top 70%',
    onEnter(self) {
      if (self.direction !== 1) return
      if (tl2.progress() === 0) tl2.play() // play only once
    },
  })

  // --- Trigger 2: lock scroll at top top ---
  section2Trigger = ScrollTrigger.create({
    trigger: staticPane.value,
    start: 'top top',
    onEnter(self) {
      if (self.direction === 1) {
        lockScroll()
      }
    },
  })
}

onMounted(() => {
  const heroEl = heroImg.value
  if (heroEl?.complete) onHeroLoaded()

  setupSection2ScrollTrigger()

  // --- Hero parallax effect (desktop only, no reduced motion) ---
  //if (!prefersReduced && isDesktop && heroEl && stage.value) {
  if (!prefersReduced && heroEl && stage.value) {
    gsap.fromTo(
      heroEl,
      { yPercent: -10 },   // start slightly up
      {
        yPercent: 10,      // end slightly down
        ease: 'none',
        scrollTrigger: {
          trigger: stage.value,     // the full-height hero section
          start: 'top top',         // when hero hits top of viewport
          end: 'bottom top',        // when hero leaves at top
          scrub: true,              // link animation to scroll
        },
      }
    )
  }
})


onBeforeUnmount(() => {
  tl?.kill()
  ScrollTrigger.killAll()
})


</script>

<template>
  <section
    ref="root"
    :class="[
      'hero-section relative h-auto',
      { 'hero--inert': !isReady }
    ]"
  >
    <div class="header flex">
      <div class="logo animate-in">
        <LogoSVG></LogoSVG>
      </div>
      <div class="header-right">
      </div>
    </div>
    <!-- SECTION 1: Full-height hero image with intro text -->
    <div
      ref="stage"
      class="hero-stage relative w-full sm::h-[calc(100dvh-78px)] md:h-[100dvh]"
    >
      <div
        ref="slide"
        data-slide
        class="hero-image relative w-full h-full"
      >
        <!-- Big hero image (full width) -->
        <img
          v-if="data?.hero"
          ref="heroImg"
          data-role="hero"
          :src="data.hero.sourceUrl"
          :alt="data.hero.altText || ''"
          class="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
          @load="onHeroLoaded"
        />
        <div
          ref="intro"
          data-intro
          class="hero-text-initial absolute inset-0 z-30 flex items-end pb-[40px] md:pb-[35px] px-[20px] md:px-10"
        >
          <div class="w-full md:flex justify-between gap-6">
            <p class="body-font-bold">a JUST home is</p>
            <p>a place where everything that’s important to you thrives!</p>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION 2: Hero text + overlay images (second 100vh section) -->
    <section
      ref="staticPane"
      data-static
      class="
        hero-details
        res-gutter
        md:h-[100dvh]
        flex flex-col md:flex-row items-end justify-between gap-10
        pt-10 md:pt-0
      "
    >
      <!-- Left: hero copy + scroll cue -->
      <div 
        ref="heroLeft"
        class="hero-left md:max-w-[30ch] lg:max-w-[44ch] flex flex-col justify-between h-full pb-[45px] md:pb-[15px]"
      >
        <div>
          <p class="hero-text body-font-medium">
            <span class="body-font-bold">JUST Design</span> is a minority-owned
            architecture and design studio specializing in thoughtful, modern
            residential projects that balance craft, function, and feeling.
          </p>
        </div>
      </div>

      <!-- Right: overlay images (collaged) -->
      <div class="hero-overlays">
        <!-- Bottom / main image -->
        <img
          v-if="data?.o2"
          ref="o2Ref"
          data-overlay
          :src="data.o2.sourceUrl"
          :alt="data.o2.altText || ''"
          class="overlay-img-2"
          loading="eager"
          decoding="async"
        />

        <!-- Top / smaller image -->
        <img
          v-if="data?.o1"
          ref="o1Ref"
          data-overlay
          :src="data.o1.sourceUrl"
          :alt="data.o1.altText || ''"
          class="overlay-img-1"
          loading="eager"
          decoding="async"
        />
      </div>
    </section>
  </section>
</template>

<style lang="scss">
html.is-locked,
body.is-locked {
  overflow: hidden;
  overscroll-behavior: contain;
}

.hero--inert [data-intro],
.hero--inert [data-static],
.hero--inert [data-overlay] {
  opacity: 0;
  visibility: hidden;
}

.hero--inert [data-role='hero'] {
  opacity: 0;
}

.hero--inert [data-slide] {
  opacity: 1;
  visibility: visible;
}

.header {
	position: absolute;
  display: flex;
}

.logo {
	top: 20px;
	left: 20px;
	color: #000;
	width: 140px;
	width: 88px;
	z-index: 99;
  mix-blend-mode: difference;
  position: fixed;
	@media (min-width: 768px) {
		top: 35px;
		left: 35px;
		width: 160px;
	}
	svg * {
		fill: currentColor;
	}
}

.hero-stage {
  .hero-image {
    position: relative;
    overflow: hidden;

    @media (max-width: 767px) {
      height: clamp(292px, 42dvh, 331px);
    }
    img {
      width: 100%;
      object-fit: cover;
      @media (min-width: 768px) {
        height: 112vh;
      }
    }
  }
}

.hero {
  &-section {
    display: flex;
    flex-direction: column;
  }
  &-left {
    @media (min-width: 768px) {
      height: 30vh;
    }
    @media (min-width: 1181px) {
      height: 46vh;
    }
    @media (min-width: 1301px) {
      height: 37vh;
    }
    @media (min-width: 1601px) {
      height: 45vh;
    }
  }
  &-text {
    font-size: clamp(20px, 2.4vw, 36px);
    line-height: 1.28;

    &-initial {
      color: #fff;
      font-size: 18px;

      @media (min-width: 768px) {
        font-size: clamp(20px, 2.5vw, 41px);
      }
    }
  }
}

img {
  image-rendering: auto;
}

.scroll-text {
  display: block;
  margin-top: 5vh;

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

// .hero-overlays {
//   /* Walker Warner–style diagonal overlap vars */
//   --start-padding: 1fr;
//   --end-padding: 1fr;
//   --first-image: 12.15fr;  // big image
//   --overlap-x: 1.51fr;     // gap/overlap band
//   --second-image: 5.12fr;  // smaller image

//   position: relative;
//   width: 100%;
//   max-width: 140rem;       // similar to their module
//   margin: 0 auto;
//   display: grid;
//   grid-template-columns: var(--start-padding) var(--first-image) var(--overlap-x) var(--second-image) var(--end-padding);
//   grid-template-rows: auto min(40.5rem, 29vw) auto;
//   align-items: center;
//   isolation: isolate;

//   @media (max-width: 767px) {
//     /* Stack nicely on mobile */
//     max-width: min(335px, 80vw);
//     grid-template-columns: 1fr;
//     grid-template-rows: auto auto;
//     row-gap: 20px;
//     padding-inline: 0;
//   }
// }

// /* Bottom / main image (like their first card) */
// .overlay-img-2 {
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   display: block;
//   grid-column: 2 / span 2;  // columns: first-image + overlap band
//   grid-row: 2 / span 2;     // lower rows
//   z-index: 1;

//   @media (max-width: 767px) {
//     grid-column: 1 / -1;
//     grid-row: 2 / 3;
//     position: relative;
//     top: 0;
//   }
// }

// /* Top / overlapping image (like their second card) */
// .overlay-img-1 {
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   display: block;
//   grid-column: 3 / span 2;  // overlap band + second-image
//   grid-row: 1 / span 2;     // higher rows so it overlaps diagonally
//   z-index: 2;
//   align-self: end;

//   @media (min-width: 768px) {
//     transform: translateY(10%); // fine-tune overlap “angle”
//   }

//   @media (max-width: 767px) {
//     grid-column: 1 / -1;
//     grid-row: 1 / 2;
//     transform: none;         // no overlap on tiny screens
//   }
// }

.hero-overlays {
  position: relative;
  width: min(43rem, 50vw);
  bottom: 40px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
  @media (min-width: 768px) {
    bottom: 16%;
  }
  @media (min-width: 1181px) {
    bottom: clamp(40px, 4vw, 91px)
  }
  @media (max-width: 767px) {
    width: min(335px, 80vw);
    margin: 40px auto 70px;
  }
  @media (max-width: 400px) {
    margin: 40px auto 85px;
  }
}

.overlay-img {
  &-1 {
    position: absolute;
    display: block;
    object-fit: cover;
    left: 0;
    top: -47%;
    @media (min-width: 768px) {
      width: 80%;
    }
    @media (min-width: 1181px) {
      width: clamp(250px, 38vw, 494px);
    }
    @media (min-width: 1601px) {
      width: clamp(494px, 32vw, 640px);
      top: -46%;
    }
    @media (min-width: 1801px) {
      width: clamp(550px, 33vw, 640px);
    }
    @media (max-width: 767px) {
      width: 65%;
      min-width: 270px;
      left: -4%;
      top: -14%;
    }
    @media (max-width: 400px) {
      min-width: 245px;
    }
  }
  &-2 {
    width: clamp(180px, 23vw, 340px);
    display: block;
    object-fit: cover;
    @media (max-width: 767px) {
      max-width: 195px;
      position: relative;
      top: 85px;
    }
    @media (max-width: 400px) {
      top: 80px;
    }
    @media (min-width: 1181px) {
      //width: clamp(250px, 38vw, 494px);
    }
    @media (min-width: 1601px) {
      width: clamp(340px, 22vw, 420px);
    }
    @media (min-width: 1801px) {
      width: clamp(375px, 22vw, 460px);
    }
  }
}
</style>
