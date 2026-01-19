<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectFade } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import 'swiper/css'
import 'swiper/css/effect-fade'

if (process.client) {
  gsap.registerPlugin(ScrollTrigger)
}

type GridItem = {
  heading?: string | null
  content?: string | null
  featuredImage?: {
    node?: {
      altText?: string | null
      sourceUrl?: string | null
    } | null
  } | null
}

const config = useRuntimeConfig()

const query = /* GraphQL */ `
  query NewQuery {
    page(id: "234", idType: DATABASE_ID) {
      residentialLp {
        contentGrid {
          heading
          content
          featuredImage {
            node {
              altText
              sourceUrl
            }
          }
        }
      }
    }
  }
`

const { data, error } = await useFetch<GridItem[]>(config.public.wordpressUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: { query },
  transform: (d: any) => (d?.data?.page?.residentialLp?.contentGrid ?? []) as GridItem[],
})

if (error.value) console.error('Error fetching residential content grid data:', error.value)

const items = computed(() => (data.value ?? []).filter(Boolean))

const swiperInstance = ref<SwiperType | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const isDesktop = ref(true)

const swiperModules = [EffectFade]

const swiperOptions = {
  modules: swiperModules,
  slidesPerView: 1,
  effect: 'fade' as const,
  fadeEffect: {
    crossFade: false
  },
  speed: 1000,
  allowTouchMove: false,
  loop: false,
  grabCursor: false,
  allowSlideNext: true,
  allowSlidePrev: true,
}

const scrollTriggers: ScrollTrigger[] = []

function onSwiper(swiper: SwiperType) {
  swiperInstance.value = swiper
}

function onSlideChange(swiper: SwiperType) {
  activeIndex.value = swiper.activeIndex
}

function setupScrollTriggers() {
  if (!containerRef.value || !swiperInstance.value) return

  // Kill existing triggers
  scrollTriggers.forEach(t => t.kill())
  scrollTriggers.length = 0

  // Set container height based on number of slides
  const slideCount = items.value.length
  if (containerRef.value) {
    containerRef.value.style.height = `${(slideCount + 1) * 100}vh`
  }

  const slideHeight = window.innerHeight

  // Create ScrollTriggers for each slide
  // Offset by +1 so first slide starts at slideHeight instead of 0
  items.value.forEach((_, index) => {
    const trigger = ScrollTrigger.create({
      trigger: containerRef.value,
      start: `top+=${slideHeight * (index + 1)} top`,
      end: `top+=${slideHeight * (index + 2)} top`,
      onEnter: () => {
        if (swiperInstance.value && swiperInstance.value.activeIndex !== index) {
          swiperInstance.value.slideTo(index, 1000)
        }
      },
      onEnterBack: () => {
        if (swiperInstance.value && swiperInstance.value.activeIndex !== index) {
          swiperInstance.value.slideTo(index, 1000)
        }
      },
    })

    scrollTriggers.push(trigger)
  })
}

onMounted(() => {
  if (typeof window === 'undefined' || !containerRef.value) return

  let wasDesktop = window.innerWidth >= 1024

  // Check if viewport is desktop (>= 1024px)
  const checkViewport = () => {
    const nowDesktop = window.innerWidth >= 1024
    isDesktop.value = nowDesktop

    // Handle transition between mobile and desktop
    if (nowDesktop && !wasDesktop) {
      // Switched from mobile to desktop
      nextTick(() => {
        setupScrollTriggers()
      })
    } else if (!nowDesktop && wasDesktop) {
      // Switched from desktop to mobile
      scrollTriggers.forEach(t => t.kill())
      scrollTriggers.length = 0
      if (containerRef.value) {
        containerRef.value.style.height = 'auto'
      }
    }

    wasDesktop = nowDesktop
  }

  checkViewport()
  window.addEventListener('resize', checkViewport)

  // Set up desktop behavior initially if on desktop
  if (isDesktop.value) {
    nextTick(() => {
      setupScrollTriggers()
    })
  } else {
    // On mobile/tablet, remove height constraint for normal stacked layout
    if (containerRef.value) {
      containerRef.value.style.height = 'auto'
    }
  }
})

onBeforeUnmount(() => {
  if (swiperInstance.value) {
    swiperInstance.value.destroy()
  }

  scrollTriggers.forEach(t => t.kill())
  scrollTriggers.length = 0
})
</script>

<template>
  <section ref="containerRef" class="residential-content-grid">
    <!-- Desktop: Swiper with scroll-through -->
    <Swiper
      v-if="isDesktop"
      v-bind="swiperOptions"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      class="content-grid__swiper"
    >
      <SwiperSlide
        v-for="(item, i) in items"
        :key="`${i}-${item?.heading ?? 'slide'}`"
        class="content-grid__slide"
      >
        <div class="content-grid__content" :class="{ 'is-reversed': i % 2 === 1 }">
          <div class="content-grid__half content-grid__media">
            <img
              v-if="item?.featuredImage?.node?.sourceUrl"
              class="content-grid__img"
              :src="item.featuredImage.node.sourceUrl"
              :alt="item.featuredImage.node.altText ?? item.heading ?? 'Residential image'"
              loading="lazy"
              decoding="async"
            />
            <div v-else class="content-grid__img-fallback" aria-hidden="true" />
          </div>

          <div class="content-grid__half content-grid__copy">
            <div class="content-grid__copy-inner">
              <h2 v-if="item?.heading" class="content-grid__heading">
                {{ item.heading }}
              </h2>
              <div v-if="item?.content" class="content-grid__body" v-html="item.content" />
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- Mobile/Tablet: Stacked layout -->
    <div v-else class="content-grid__mobile res-gutter">
      <div
        v-for="(item, i) in items"
        :key="`mobile-${i}-${item?.heading ?? 'item'}`"
        class="content-grid__mobile-item"
      >
        <div class="content-grid__mobile-media">
          <img
            v-if="item?.featuredImage?.node?.sourceUrl"
            class="content-grid__mobile-img"
            :src="item.featuredImage.node.sourceUrl"
            :alt="item.featuredImage.node.altText ?? item.heading ?? 'Residential image'"
            loading="lazy"
            decoding="async"
          />
          <div v-else class="content-grid__img-fallback" aria-hidden="true" />
        </div>

        <div class="content-grid__mobile-copy">
          <h2 v-if="item?.heading" class="content-grid__mobile-heading">
            {{ item.heading }}
          </h2>
          <div v-if="item?.content" class="content-grid__mobile-body" v-html="item.content" />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.residential-content-grid {
  position: relative;
  /* Height is multiplied by number of slides to allow scroll-through */
  /* This will be set dynamically, but we default to 300vh for 3 slides */
  min-height: 300vh;
}

.content-grid__swiper {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
}

.content-grid__slide {
  width: 100%;
  height: 100%;
}

.content-grid__content {
  width: 100%;
  height: 100%;
  display: flex;

  &.is-reversed {
    flex-direction: row-reverse;
  }
}

.content-grid__half {
  width: 50%;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.content-grid__media {
  overflow: hidden;
  background: #1a1a1a;
}

.content-grid__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.content-grid__img-fallback {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.content-grid__copy {
  background: var(--residential-background-color);
  padding: clamp(24px, 5vw, 80px);
  overflow-y: auto;
}

.content-grid__copy-inner {
  max-width: 550px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  @media (max-width: 1461px) {
    max-width: 628px;
  }
}

.content-grid__heading {
  margin: 0 0 16px;
  font-size: clamp(22px, 1.8vw, 34px);
  line-height: 1.15;
  font-family: 'Inter Medium';
}

.content-grid__body {
  font-size: clamp(17px, 1.375vw, 24px);
  line-height: 1.5;
  color: #333;

  :deep(p) {
    margin: 0 0 1em;
  }

  :deep(p:last-child) {
    margin-bottom: 0;
  }

  :deep(strong) {
    font-weight: 600;
  }
}

/* Mobile/Tablet stacked layout (< 1024px) */
.content-grid__mobile {
  width: 100%;
  margin-bottom: 55px;
}

.content-grid__mobile-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 88px;

  &:last-child {
    margin-bottom: 0;
  }
}

.content-grid__mobile-media {
  width: 100%;
  margin-bottom: 38px;
}

.content-grid__mobile-img {
  width: 100%;
  max-height: 615px;
  height: auto;
  display: block;
  object-fit: cover;
}

.content-grid__mobile-copy {
  width: 100%;
}

.content-grid__mobile-heading {
  margin: 0 0 28px;
  font-size: clamp(24px, 4vw, 32px);
  line-height: 1.2;
}

.content-grid__mobile-body {
  font-size: clamp(18px, 2.75vw, 22px);
  line-height: 1.5;
  color: #333;

  :deep(p) {
    margin: 0 0 1em;
  }

  :deep(p:last-child) {
    margin-bottom: 0;
  }

  :deep(strong) {
    font-weight: 600;
  }
}

/* Desktop only - hide on mobile/tablet */
@media (max-width: 1023px) {
  .residential-content-grid {
    min-height: auto !important;
    height: auto !important;
  }

  .content-grid__swiper {
    display: none;
  }
}

/* Mobile responsive for desktop layout (if visible on small screens) */
@media (max-width: 900px) {
  .content-grid__content,
  .content-grid__content.is-reversed {
    flex-direction: column;
  }

  .content-grid__half {
    width: 100%;
    height: 50vh;
  }

  .content-grid__copy {
    padding: clamp(24px, 5vw, 40px);
  }

  .content-grid__copy-inner {
    text-align: left;
  }
}
</style>