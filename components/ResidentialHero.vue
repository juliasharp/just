<script setup lang="ts">
import gsap from 'gsap'
import LogoSVG from '/src/just-logo-res.svg?component';
import ScrollTrigger from 'gsap/ScrollTrigger';
<<<<<<< Updated upstream
=======
import { useLogoVisibility } from '~~/composables/useLogoVisibility'
import { useSectionScrollAnims } from '~/composables/useSectionScrollAnims'
>>>>>>> Stashed changes

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
        whoWeAre
        ctaLeftBg {
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
      whoweare: lp?.whoWeAre || '',
      ctaBg: lp?.ctaLeftBg?.node || null,
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

const { initPanelAnims, killAll } = useSectionScrollAnims()

const heroTriggers: ScrollTrigger[] = []

let tl: gsap.core.Timeline | null = null

const isReady = ref(false) // hide intro / static / overlays until animation sets them

// Hover state for collage images
const hoveredImage = ref<number | null>(null)

function handleImageHover(imageNum: number) {
  hoveredImage.value = imageNum
}

function handleImageLeave(imageNum: number) {
  if (hoveredImage.value === imageNum) {
    hoveredImage.value = null
  }
}

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const isDesktop =
  typeof window !== 'undefined'
    ? window.matchMedia?.('(min-width: 768px)').matches
    : true // SSR fallback

const isLogoHidden = ref(false)
let lastScrollY = 0
const HIDE_THRESHOLD = 3000 // px – tweak this if you want it later/earlier

/* Logo/header visibility state */
function handleScroll() {
  const current = window.scrollY || document.documentElement.scrollTop
  const isScrollingDown = current > lastScrollY

  if (isScrollingDown && current > HIDE_THRESHOLD) {
    // Scrolling down past threshold → hide logo
    isLogoHidden.value = true
  } else {
    // Scrolling up OR above top threshold → show logo
    isLogoHidden.value = false
  }

  lastScrollY = current
}

function onHeroLoaded() {
  requestAnimationFrame(() => {
    runAnimation()
    isReady.value = true
    ScrollTrigger.refresh(true)
  })
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

  // Reduced motion / mobile: show everything
  if (prefersReduced || !isDesktop) {
    gsap.set(staticPane.value, { autoAlpha: 1, y: 0 })
    if (o2Ref.value) gsap.set(o2Ref.value, { autoAlpha: 1, y: 0, scale: 1 })
    if (o1Ref.value) gsap.set(o1Ref.value, { autoAlpha: 1, y: 0, scale: 1 })
    if (heroLeft.value) gsap.set(heroLeft.value, { autoAlpha: 1, y: 0 })
    return
  }

  // Initial hidden states - don't animate y on staticPane to avoid pin-spacer gap issues
  gsap.set(staticPane.value, { autoAlpha: 0 })
  if (o2Ref.value) gsap.set(o2Ref.value, { autoAlpha: 0, y: 24, scale: 1.02 })
  if (o1Ref.value) gsap.set(o1Ref.value, { autoAlpha: 0, y: 24, scale: 1.02 })
  if (heroLeft.value) gsap.set(heroLeft.value, { autoAlpha: 0, y: 24 })

  // Timeline for section 2
  const tl2 = gsap.timeline({
    paused: true,
    defaults: { ease: 'power3.out' },
  })

  tl2.to(staticPane.value, { autoAlpha: 1, duration: 0.9 }, 0)

  if (o2Ref.value) tl2.to(o2Ref.value, { autoAlpha: 1, y: 0, scale: 1, duration: 1.6 }, 0.1)
  if (o1Ref.value) tl2.to(o1Ref.value, { autoAlpha: 1, y: 0, scale: 1, duration: 1.6 }, '-=1.0')
  if (heroLeft.value) tl2.to(heroLeft.value, { autoAlpha: 1, y: 0, duration: 0.75 }, '-=0.3')

  // Trigger: play when entering
  heroTriggers.push(
    ScrollTrigger.create({
      trigger: staticPane.value,
      start: 'top 75%',
      onEnter: () => tl2.play(),
      onEnterBack: () => tl2.play(),
    })
  )
}

onMounted(() => {
  const heroEl = heroImg.value

  // 1) Hero image load-triggered intro animation
  if (heroEl?.complete) onHeroLoaded()

  // 2) Generic panel enter/exit animations for this component
  // IMPORTANT: do NOT nest onMounted inside onMounted.
  if (root.value) {
    initPanelAnims(root.value, {
      start: 'top 75%',
      once: false,
      animateOnEnterBack: true,
    })
  }

  // 3) Your custom Section 2 timeline + pin/hold
  setupSection2ScrollTrigger()

<<<<<<< Updated upstream
  // --- Hero parallax effect (desktop only, no reduced motion) ---
  //if (!prefersReduced && isDesktop && heroEl && stage.value) {
=======
  // 4) Pin the hero-details section for a moment
  if (!prefersReduced && isDesktop && staticPane.value) {
    heroTriggers.push(
      ScrollTrigger.create({
        trigger: staticPane.value,
        start: 'top top',
        end: '+=50%', // Pin for 50% of viewport height of scroll
        pin: true,
        pinSpacing: true,
      })
    )
  }

  // 4) Hero parallax ScrollTrigger
>>>>>>> Stashed changes
  if (!prefersReduced && heroEl && stage.value) {
    const tween = gsap.fromTo(
      heroEl,
      { yPercent: -15 },
      {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: stage.value,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      }
    )

    // Track the ScrollTrigger created by this tween so we can kill it.
    if ((tween as any).scrollTrigger) {
      heroTriggers.push((tween as any).scrollTrigger)
    }
  }

<<<<<<< Updated upstream
  /* scroll listener */
  lastScrollY = window.scrollY || 0
  window.addEventListener('scroll', handleScroll, { passive: true })
=======
  // 6) Refresh ScrollTrigger on resize to recalculate pin positions
  let resizeTimeout: ReturnType<typeof setTimeout> | null = null
  const handleResize = () => {
    if (resizeTimeout) clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 200)
  }
  window.addEventListener('resize', handleResize)

  // Store cleanup function
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    if (resizeTimeout) clearTimeout(resizeTimeout)
  })
>>>>>>> Stashed changes
})

onBeforeUnmount(() => {
  // Kill your hero intro timeline
  tl?.kill()
<<<<<<< Updated upstream
  ScrollTrigger.killAll()

  window.removeEventListener('scroll', handleScroll)
=======
  tl = null

  // Kill triggers you created locally in this component
  heroTriggers.forEach((t) => t.kill())
  heroTriggers.length = 0

  // Kill triggers created by useSectionScrollAnims
  killAll()
>>>>>>> Stashed changes
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
      class="hero-stage snap-section snap-panel relative w-full"
    >
      <div
        ref="slide"
        data-slide
        class="hero-image relative w-full h-full"
      >
        <!-- Big hero image (full width) -->
        <img
          v-if="data?.hero?.sourceUrl"
          ref="heroImg"
          data-role="hero"
          :src="data.hero.sourceUrl"
          :alt="data.hero.altText || ''"
          class="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
          @load="onHeroLoaded"
        />
        <div v-else class="absolute inset-0 bg-gray-300" @load="onHeroLoaded" />
        <div
          ref="intro"
          data-intro
          class="hero-text-initial absolute inset-0 z-30 flex items-center justify-center pt-[80px] px-[12px] md:px-10"
        >
          <p class="body-font-bold">
            <span>
              Bold ideas. Meaningful homes.
            </span>
            <span>
              Designed around you.
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- SECTION 2: Hero details (second section) -->
    <section
      ref="staticPane"
      data-static
<<<<<<< Updated upstream
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
=======
      class="hero-details"
    >
      <!-- Left: Background image with brown overlay and text -->
      <div class="hero-details__left">
        <img
          v-if="data?.ctaBg?.sourceUrl"
          :src="data.ctaBg.sourceUrl"
          :alt="data.ctaBg.altText || 'Background'"
          class="hero-details__bg-img"
          loading="eager"
          decoding="async"
        />
        <div v-else class="hero-details__bg-placeholder" />
        <div
          ref="heroLeft"
          class="hero-details__text-block"
        >
          <div class="hero-details__text body-font-medium" v-html="data?.whoweare || 'No content available'" />
        </div>

        <!-- Mobile overlay: second collage image at bottom -->
        <div class="hero-details__mobile-overlay">
          <img
            v-if="data?.o2?.sourceUrl"
            :src="data.o2.sourceUrl"
            :alt="data.o2.altText || ''"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      <!-- Right: Layered images with hover-to-front effect -->
      <div class="hero-details__right">
        <div
          :class="[
            'hero-details__collage',
            { 'hover-image-1': hoveredImage === 1 },
            { 'hover-image-2': hoveredImage === 2 }
          ]"
        >
          <!-- Image 1 (top-right position) - base layer -->
          <div
            class="hero-details__collage-item hero-details__collage-item--1"
            @mouseenter="handleImageHover(1)"
            @mouseleave="handleImageLeave(1)"
          >
            <img
              v-if="data?.o1?.sourceUrl"
              ref="o1Ref"
              data-overlay
              :src="data.o1.sourceUrl"
              :alt="data.o1.altText || ''"
              class="hero-details__collage-img"
              loading="eager"
              decoding="async"
            />
            <div v-else class="hero-details__img-placeholder" />
          </div>

          <!-- Image 2 (bottom-left position) - base layer -->
          <div
            class="hero-details__collage-item hero-details__collage-item--2"
            @mouseenter="handleImageHover(2)"
            @mouseleave="handleImageLeave(2)"
          >
            <img
              v-if="data?.o2?.sourceUrl"
              ref="o2Ref"
              data-overlay
              :src="data.o2.sourceUrl"
              :alt="data.o2.altText || ''"
              class="hero-details__collage-img"
              loading="eager"
              decoding="async"
            />
            <div v-else class="hero-details__img-placeholder" />
          </div>

          <!-- Hover layers - positioned absolutely at collage root for proper z-index -->
          <div
            class="hero-details__collage-hover hero-details__collage-hover--1"
            @mouseenter="handleImageHover(1)"
            @mouseleave="handleImageLeave(1)"
          >
            <img
              v-if="data?.o1?.sourceUrl"
              :src="data.o1.sourceUrl"
              :alt="data.o1.altText || ''"
              class="hero-details__collage-img"
              loading="eager"
              decoding="async"
            />
          </div>

          <div
            class="hero-details__collage-hover hero-details__collage-hover--2"
            @mouseenter="handleImageHover(2)"
            @mouseleave="handleImageLeave(2)"
          >
            <img
              v-if="data?.o2?.sourceUrl"
              :src="data.o2.sourceUrl"
              :alt="data.o2.altText || ''"
              class="hero-details__collage-img"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
>>>>>>> Stashed changes
      </div>
    </section>
  </section>
</template>

<style lang="scss">
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
    transform: translateY(-120%);
    opacity: 0;
    pointer-events: none;
  }
}

.hero-stage {
  .hero-image {
    position: relative;
    overflow: hidden;
    img {
      width: 100%;
      object-fit: cover;
      height: 118vh;
      @media (max-width: 767px) {
        object-position: 42% 50%;
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
      height: 34vh;
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
    font-size: clamp(20px, 2.4vw, 27px);
    @media (min-width: 768px) {
      font-size: clamp(27px, 2.4vw, 36px);
    }
    line-height: 1.28;

    &-initial {
      color: #fff;
      font-size: 14px;
      text-align: center;
      font-size: 22px;
      @media (min-width: 768px) {
        font-size: clamp(20px, 2.5vw, 41px);
      }
      @media (max-width: 767px) {
        span {
          display: block;
        }
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

<<<<<<< Updated upstream
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
  @media (min-width: 1601px) {
    bottom: clamp(40px, 2.5vw, 91px)
  }
  @media (max-width: 767px) {
    width: min(335px, 80vw);
    margin: 40px auto 70px;
  }
  @media (max-width: 400px) {
    margin: 40px auto 85px;
=======
.hero-details {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;

  @media (min-width: 1024px) {
    flex-direction: row;
    height: 100vh;
  }

  // Left side: background image + brown text block
  &__left {
    position: relative;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 120px 20px 60px;

    @media (min-width: 1024px) {
      width: 50vw;
      height: 100vh;
      min-height: unset;
      padding: 0;
      justify-content: center;
    }
  }

  &__bg-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
>>>>>>> Stashed changes
  }

<<<<<<< Updated upstream
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
      width: clamp(494px, 30vw, 640px);
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
    @media (min-width: 768px) {
      width: clamp(210px, 23vw, 340px);
    }
    @media (max-width: 400px) {
      top: 80px;
    }
    @media (min-width: 1181px) {
      //width: clamp(250px, 38vw, 494px);
    }
    @media (min-width: 1601px) {
      width: clamp(340px, 20vw, 420px);
    }
    @media (min-width: 1801px) {
      width: clamp(375px, 22vw, 460px);
=======
  &__bg-placeholder {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    z-index: 1;
  }

  &__text-block {
    position: relative;
    z-index: 2;
    background-color: var(--accent-color-brown);
    padding: 90px 25px;
    max-width: 635px;
    width: 90%;

    @media (min-width: 1024px) {
      width: 70%;
    }
  }

  &__text {
    color: #FFFFFF;
    font-size: clamp(18px, 1.75vw, 32px);
    line-height: 1.5;
    text-align: center;

    p {
      margin: 0 0 1em;

      &:last-child {
        margin-bottom: 0;
      }
    }

    strong {
      font-weight: 700;
    }
  }

  // Right side: collage grid with hover-to-front effect
  &__right {
    position: relative;
    width: 100%;
    min-height: 500px;

    // Hide on mobile - we show overlay image differently
    display: none;

    @media (min-width: 1024px) {
      display: block;
      width: 50vw;
      height: 100vh;
      min-height: unset;
    }
  }

  // Mobile overlay image - shows second collage image below text block
  &__mobile-overlay {
    display: block;
    position: relative;
    width: 85%;
    max-width: 400px;
    z-index: 3;
    margin-top: 40px;

    @media (min-width: 1024px) {
      display: none;
    }

    img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
    }
  }

  // CSS Grid collage container - ensures images never disconnect
  &__collage {
    position: relative;
    width: 100%;
    height: 100%;
    display: grid;
    // 12-column grid for precise positioning
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(12, 1fr);
    padding: 40px 20px;

    @media (min-width: 1024px) {
      padding: 60px;
>>>>>>> Stashed changes
    }
  }

  // Base layer items
  &__collage-item {
    position: relative;
    cursor: pointer;
    overflow: hidden;
  }

  // Image 1: Top-right position (landscape)
  &__collage-item--1 {
    grid-column: 4 / 13;
    grid-row: 1 / 7;
    z-index: 1;

    @media (min-width: 1024px) {
      grid-column: 5 / 13;
      grid-row: 1 / 7;
    }
  }

  // Image 2: Bottom-left position (portrait)
  &__collage-item--2 {
    grid-column: 1 / 8;
    grid-row: 5 / 13;
    z-index: 2;

    @media (min-width: 1024px) {
      grid-column: 1 / 7;
      grid-row: 5 / 13;
    }
  }

  // Hover layers - same grid positions but higher z-index, hidden by default
  &__collage-hover {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    opacity: 0;
    z-index: 10;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  // Hover layer for image 1 - same position as base
  &__collage-hover--1 {
    grid-column: 4 / 13;
    grid-row: 1 / 7;

    @media (min-width: 1024px) {
      grid-column: 5 / 13;
      grid-row: 1 / 7;
    }
  }

  // Hover layer for image 2 - same position as base
  &__collage-hover--2 {
    grid-column: 1 / 8;
    grid-row: 5 / 13;

    @media (min-width: 1024px) {
      grid-column: 1 / 7;
      grid-row: 5 / 13;
    }
  }

  // When image 1 is hovered, show its hover layer
  &__collage.hover-image-1 &__collage-hover--1 {
    opacity: 1;
    pointer-events: auto;
  }

  // When image 2 is hovered, show its hover layer
  &__collage.hover-image-2 &__collage-hover--2 {
    opacity: 1;
    pointer-events: auto;
  }

  // Subtle scale effect on hover layer images
  &__collage-hover &__collage-img {
    transform: scale(1);
    transition: transform 0.6s ease;
  }

  &__collage.hover-image-1 &__collage-hover--1 &__collage-img,
  &__collage.hover-image-2 &__collage-hover--2 &__collage-img {
    transform: scale(1.01);
  }

  &__collage-img { 
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__img-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%);
  }
}
</style>
