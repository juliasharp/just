<script setup lang="ts">
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const galleryContainer = ref<HTMLElement | null>(null)
const rowTop = ref<HTMLElement | null>(null)
const rowBottom = ref<HTMLElement | null>(null)

const SLIDE_AMOUNT = 80
let ctx: gsap.Context | null = null

function initAnimation() {
  ctx = gsap.context(() => {
    gsap.fromTo(
      rowBottom.value,
      { x: SLIDE_AMOUNT },
      {
        x: -SLIDE_AMOUNT,
        ease: 'none',
        scrollTrigger: {
          trigger: galleryContainer.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      }
    )
    gsap.fromTo(
      rowTop.value,
      { x: -SLIDE_AMOUNT },
      {
        x: SLIDE_AMOUNT,
        ease: 'none',
        scrollTrigger: {
          trigger: galleryContainer.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      }
    )
  }, galleryContainer.value!)
}

function killAnimation() {
  ctx?.revert()
  ctx = null
  // Reset transforms so rows sit in their natural position on mobile
  gsap.set([rowBottom.value, rowTop.value], { x: 0 })
}

const isDesktop = ref(false)

function onResize() {
  const desktop = window.innerWidth >= 768
  if (desktop === isDesktop.value) return
  isDesktop.value = desktop
  if (desktop) {
    initAnimation()
  } else {
    killAnimation()
  }
}

onMounted(() => {
  isDesktop.value = window.innerWidth >= 768
  if (isDesktop.value) initAnimation()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  killAnimation()
  window.removeEventListener('resize', onResize)
})

const config = useRuntimeConfig()

const query = `
  query NewQuery {
    page(id: "435", idType: DATABASE_ID) {
      emptyChair {
        gallerySectionTitle
        imageGallery {
          imageOrVideo {
            node {
              mimeType
              sourceUrl
              mediaItemUrl
              altText
            }
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
    return {
      gallerySectionTitle: d?.data?.page?.emptyChair?.gallerySectionTitle,
      imageGallery: d?.data?.page?.emptyChair?.imageGallery ?? [],
    }
  }
})

</script>

<template>
  <div class="emptychair-gallery">
    <div class="ec-container">
      <h2 class="gallery-section-title ec-section-title">{{ data?.gallerySectionTitle }}</h2>
    </div>
    <div class="gallery-container" ref="galleryContainer">
      <div class="gallery-row gallery-row--bottom" ref="rowBottom">
        <div v-for="(item, index) in data?.imageGallery?.slice(0, 5)" :key="index" :class="`gallery-item gallery-item--${Number(index) + 1}`">
          <img
            v-if="item.imageOrVideo?.node?.mimeType?.startsWith('image/')"
            :src="item.imageOrVideo.node.sourceUrl"
            :alt="item.imageOrVideo.node.altText || 'Empty Chair Gallery Image'"
            class="gallery-img"
            decoding="async"
          />
          <video
            v-else-if="item.imageOrVideo?.node?.mimeType?.startsWith('video/')"
            :src="item.imageOrVideo.node.mediaItemUrl || item.imageOrVideo.node.sourceUrl"
            :aria-label="item.imageOrVideo.node.altText || 'Empty Chair Gallery Video'"
            class="gallery-video"
            autoplay
            loop
            muted
            playsinline
          />
        </div>
      </div>
      <div class="gallery-row gallery-row--top" ref="rowTop">
        <div v-for="(item, index) in data?.imageGallery?.slice(5)" :key="index" :class="`gallery-item gallery-item--${Number(index) + 6}`">
          <img
            v-if="item.imageOrVideo?.node?.mimeType?.startsWith('image/')"
            :src="item.imageOrVideo.node.sourceUrl"
            :alt="item.imageOrVideo.node.altText || 'Empty Chair Gallery Image'"
            class="gallery-img"
            decoding="async"
          />
          <video
            v-else-if="item.imageOrVideo?.node?.mimeType?.startsWith('video/')"
            :src="item.imageOrVideo.node.mediaItemUrl || item.imageOrVideo.node.sourceUrl"
            :aria-label="item.imageOrVideo.node.altText || 'Empty Chair Gallery Video'"
            class="gallery-video"
            autoplay
            loop
            muted
            playsinline
          />
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">
.emptychair-gallery {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.gallery-container {
  padding: 40px 0 80px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media (min-width: 768px) {
    gap: 24px;
  }
  @media (min-width: 1381px) {
    gap: 35px;
  }
  @media (max-width: 767px) {
    padding: 0 1rem 50px;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 16px;
  }
}

.gallery-row {
  display: flex;
  gap: 16px;
  @media (min-width: 768px) {
    gap: 24px;
  }
  @media (min-width: 1381px) {
    gap: 36px;
  }
  margin-left: -4%;
  margin-right: -4%;

  @media (max-width: 767px) {
    margin-left: 0;
    margin-right: 0;
    display: contents;
  }

  &--bottom {
    align-items: center;
    @media (min-width: 768px) {
      align-items: flex-end;
    }
  }

  &--top {
    align-items: center;
    @media (min-width: 768px) {
      align-items: flex-start;
    }
  }
}

.gallery-item {
  width: calc(20% - 36px * 4 / 5);
  flex-shrink: 0;
  @media (max-width: 767px) {
    width: auto;
    grid-column: span 6;
  }
  &--3 {
    @media (max-width: 767px) {
      grid-column: span 8;
    }
    @media (min-width: 768px) {
      width: calc(24% - 28.8px);
    }
  }
  &--4 {
    @media (max-width: 767px) {
      grid-column: span 4;
    }
    @media (min-width: 768px) {
      width: calc(14% - 28.8px);
    }
  }
  &--5 {
    @media (min-width: 768px) {
      width: calc(22% - 28.8px);
    }
    @media (max-width: 767px) {
      grid-column: span 7;
    }
  }
  &--6 {
    @media (min-width: 768px) {
      width: calc(16% - 28.8px);
    }
    @media (max-width: 767px) {
      grid-column: span 5;
    }
  }
  &--7 {
    @media (min-width: 768px) {
      width: calc(23% - 28.8px);
    }
  }
  &--8 {
    @media (min-width: 768px) {
      width: calc(24% - 28.8px);
    }
  }
  &--9 {
    @media (min-width: 768px) {
      width: calc(25% - 28.8px);
    }
    @media (max-width: 767px) {
      grid-column: span 9;
    }
  }
  &--10 {
    @media (min-width: 768px) {
      width: calc(12% - 28.8px);
    }
    @media (max-width: 767px) {
      grid-column: span 3;
    }
  }
}

.gallery-img,
.gallery-video {
  width: 100%;
  height: auto;
  display: block;
}
</style>