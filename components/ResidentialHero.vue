<script setup lang="ts">
import gsap from 'gsap'
import LogoSVG from '/src/just-logo-res.svg?component';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useLogoVisibility } from '~~/composables/useLogoVisibility'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const { isLogoHidden } = useLogoVisibility()

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
const logoRef = ref<HTMLElement | null>(null)


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
    gsap.set(intro.value, { autoAlpha: 1, y: 0 })
    if (logoRef.value) {
      gsap.set(logoRef.value, { autoAlpha: 1, y: 0 })
    }
    return
  }

  // Prepare elements for animation
  gsap.set([stage.value, slide.value, intro.value, heroImg.value], {
    willChange: 'transform, opacity',
  })

  // Initial states
  gsap.set(heroImg.value, { autoAlpha: 0, scale: 1.02 }) // bg slightly zoomed + hidden
  gsap.set(intro.value, { autoAlpha: 0, y: 16 })         // bottom text hidden + down
  if (logoRef.value) {
    gsap.set(logoRef.value, { autoAlpha: 0, y: 0 })    // logo hidden + slightly up
  }

  // 1) Background hero image fades in slowly
  tl.to(heroImg.value, {
    autoAlpha: 1,
    scale: 1,
    duration: 2.5,
  })

  // 2) Logo appears
  if (logoRef.value) {
    tl.to(
      logoRef.value,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
      },
      '-=1.2' // ← Start logo fade when hero fade still has ~1.2s remaining
    )
  }

  // 3) Bottom text comes in and stays
  tl.to(intro.value, {
    autoAlpha: 1,
    y: 0,
    duration: 0.6,
  })
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
  if (!prefersReduced && heroEl && stage.value) {
    gsap.fromTo(
      heroEl,
      { yPercent: -15 },   // start slightly up
      {
        yPercent: 15,      // end slightly down
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
    <header class="header flex">
      <div ref="logoRef" class="logo animate-in" :class="{ 'logo--hidden': isLogoHidden }">
        <LogoSVG></LogoSVG>
      </div>
    </header>
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
          class="hero-text-initial absolute inset-0 z-30 flex items-end pb-[60px] md:pb-[35px] px-[12px] md:px-10"
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
        just-container
        res-gutter
        md:min-h-[100dvh]
        flex flex-col md:flex-row items-end justify-between gap-10
        pt-10 md:pt-0
      "
    >
      <!-- Left: hero copy + scroll cue -->
      <div 
        ref="heroLeft"
        class="hero-left md:max-w-[28ch] lg:max-w-[44ch] flex flex-col justify-between h-full pb-[45px] md:pb-[15px]"
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
        <div class="hero-overlays__frame">
          <div class="hero-overlays__grid">
            <div class="overlay-card overlay-card__wide">
              <div class="image-card__holder image-card__wide">
                <div class="image-card">
                  <img
                    v-if="data?.o1"
                    ref="o2Ref"
                    data-overlay
                    :src="data.o1.sourceUrl"
                    :alt="data.o1.altText || ''"
                    class="overlay-img-1"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
            
            <div class="overlay-card overlay-card__tall">
              <div class="image-card__holder image-card__tall">
                <div class="image-card">
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
                </div>
              </div>
            </div>
          </div>
        </div>
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

.hero--inert .logo {
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
	color: #fff;
	width: 140px;
	width: 88px;
	z-index: 99;
  transition:
    transform 0.35s ease,
    opacity 0.35s ease;
  //mix-blend-mode: difference;
  //position: fixed;
	@media (min-width: 768px) {
    mix-blend-mode: difference;
    position: fixed;
		top: 35px;
		left: 35px;
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
        height: 118vh;
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
    @media (min-width: 1301px) {
      height: 37vh;
    }
    @media (min-width: 1601px) {
      height: 45vh;
    }
    @media (min-width: 1801px) {
      height: auto;
      padding-bottom: 50px;
    }
  }
  &-text {
    font-size: clamp(20px, 2.4vw, 27px);
    @media (min-width: 768px) {
      font-size: clamp(25px, 2.4vw, 36px);
    }
    line-height: 1.28;

    &-initial {
      color: #fff;
      font-size: 14px;

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

.hero-details {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-end;
    /* allow the whole section to be tall, but not forced into exactly 100vh */
    min-height: min(100dvh, 900px);
    gap: 2rem;
  }
  @media (min-width: 1181px) {
    min-height: min(100dvh, 1200px);
    gap: 5rem;
  }
}

.hero-overlays {
  width: 100%;
  @media (min-width: 768px) {
    flex: 1 1 0;
    align-self: center;
  }

  &__frame {
    width: 100%;
    position: relative;
    margin: 0 auto;
    @media (min-width: 768px) {
      height: clamp(27rem, 48vh, 60vh); 
    }
    @media (min-width: 1181px) {
      height: clamp(32rem, 63vh, 80vh); 
    }
    @media (min-width: 1581px) {
      height: clamp(32rem, 92vh, 92vh); 
    }
  }

  &__grid {
    /* layout vars */
    --start-padding: 0.5fr;
    --end-padding: 0.5fr;
    --first-image: 9.15fr;
    --overlap-x: 1.5fr;
    --second-image: 5.12fr;

    inset: 0;
    display: grid;
    width: 100%;
    height: 100%;
    isolation: isolate;

    grid-template-columns: 
      var(--start-padding) 
      var(--first-image) 
      var(--overlap-x) 
      var(--second-image) 
      var(--end-padding);

    grid-template-rows: auto auto auto;

    align-items: center;
    justify-content: center;

    @media (max-width: 767px) {
      row-gap: 20px;
    }
  }
}

/* Bottom / main image (like their first card) */
.overlay-img-2 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
  @media (max-width: 767px) {
    position: relative;
    top: 0;
  }
}

/* Top / overlapping image (like their second card) */
.overlay-img-1 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
}

.overlay-card {
  width: 100%;
  position: relative;
  overflow: hidden;
  &__wide {
    grid-column: 2 / span 2;  // same as before
    grid-row: 1 / span 2;
    z-index: 2;
  }
  &__tall {
    grid-column: 3 / span 2;  // same as before
    grid-row: 2 / span 2;     
    z-index: 1;
    align-self: center;
  }
}

.image-card {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  &__wide {
    position: relative;
    width: 100%;
    padding-top: 55%;
    height: unset;
    @media (min-width: 768px) {
      padding-top: 70%;
    }
    @media (min-width: 1181px) {
      padding-top:66%;
    }
    @media (min-width: 1381px) {
      padding-top: 55%;
    }
  }

  &__tall {
    padding-top: 133%;
    height: unset;
    position: relative;
    width: 100%;
    @media (min-width: 768px) {
      padding-top: 166%;
    }
    @media (min-width: 1451px) {
      padding-top: 133%;
    }
  }
}

// .hero-overlays {
//   position: relative;
//   width: min(43rem, 50vw);
//   bottom: 40px;
//   margin: 0 auto;
//   display: flex;
//   justify-content: flex-end;
//   @media (min-width: 768px) {
//     bottom: 16%;
//   }
//   @media (min-width: 1181px) {
//     bottom: clamp(40px, 4vw, 91px)
//   }
//   @media (min-width: 1601px) {
//     bottom: clamp(40px, 2.5vw, 91px)
//   }
//   @media (max-width: 767px) {
//     width: min(335px, 80vw);
//     margin: 40px auto 70px;
//   }
//   @media (max-width: 400px) {
//     margin: 40px auto 85px;
//   }
// }

// .overlay-img {
//   &-1 {
//     position: absolute;
//     display: block;
//     object-fit: cover;
//     left: 0;
//     top: -47%;
//     @media (min-width: 768px) {
//       width: 80%;
//     }
//     @media (min-width: 1181px) {
//       width: clamp(250px, 38vw, 494px);
//     }
//     @media (min-width: 1601px) {
//       width: clamp(494px, 30vw, 640px);
//       top: -46%;
//     }
//     @media (min-width: 1801px) {
//       width: clamp(550px, 33vw, 640px);
//     }
//     @media (max-width: 767px) {
//       width: 65%;
//       min-width: 270px;
//       left: -4%;
//       top: -14%;
//     }
//     @media (max-width: 400px) {
//       min-width: 245px;
//     }
//   }
//   &-2 {
//     width: clamp(180px, 23vw, 340px);
//     display: block;
//     object-fit: cover;
//     @media (max-width: 767px) {
//       max-width: 195px;
//       position: relative;
//       top: 85px;
//     }
//     @media (min-width: 768px) {
//       width: clamp(210px, 23vw, 340px);
//     }
//     @media (max-width: 400px) {
//       top: 80px;
//     }
//     @media (min-width: 1181px) {
//       //width: clamp(250px, 38vw, 494px);
//     }
//     @media (min-width: 1601px) {
//       width: clamp(340px, 20vw, 420px);
//     }
//     @media (min-width: 1801px) {
//       width: clamp(375px, 22vw, 460px);
//     }
//   }
// }
</style>
