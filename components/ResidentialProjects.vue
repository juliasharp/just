<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed, ref, nextTick } from 'vue'
import { useLogoVisibility } from '~~/composables/useLogoVisibility'

const { isLogoHidden } = useLogoVisibility()

let gsap: any
let ScrollTrigger: any
let prefersReduced = false

const projectsSection = ref<HTMLElement | null>(null)

const {
  public: {
    wordpressUrl,
    residentialPageId = ''
  }
} = useRuntimeConfig()

const QUERY_BY_URI = /* GraphQL */ `
  query ResidentialProjectsByUri($uri: String!) {
    page(id: $uri, idType: URI) {
      id
      uri
      title
      residentialLp {
        projects {
          featuredImage { node { altText sourceUrl } }
          location
          projectName
          year
          photoGallery { nodes { altText sourceUrl } }
        }
      }
    }
  }
`

const QUERY_BY_ID = /* GraphQL */ `
  query ResidentialProjectsById($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      id
      uri
      title
      residentialLp {
        projects {
          featuredImage { node { altText sourceUrl } }
          location
          projectName
          year
          photoGallery { nodes { altText sourceUrl } }
        }
      }
    }
  }
`

type GqlImageNode = { altText?: string | null; sourceUrl?: string | null }
type GqlProject = {
  featuredImage?: { node?: GqlImageNode | null } | null
  location?: string | null
  projectName?: string | null
  year?: string | number | null
  photoGallery?: { nodes?: GqlImageNode[] | null } | null
}

async function fetchProjects() {
  if (!residentialPageId) {
    console.warn('No residentialPageId provided')
    return { page: null, projects: [] as GqlProject[] }
  }

  try {
    const res: any = await $fetch(wordpressUrl, {
      method: 'POST',
      body: {
        query: QUERY_BY_ID,
        variables: { id: residentialPageId },
      },
    })

    const page = res?.data?.page ?? null

    return {
      page,
      projects: (page?.residentialLp?.projects ?? []) as GqlProject[],
    }
  } catch (e) {
    console.error(
      'Residential (ID) fetch failed',
      e instanceof Error ? e.message : e
    )
    return { page: null, projects: [] as GqlProject[] }
  }
}

const { data, error, pending } = await useAsyncData('residential-projects', fetchProjects, {
  default: () => ({ page: null, projects: [] })   // <— prevents null on first SSR pass
})

// Convenient refs
const page = computed(() => data.value?.page ?? null)
const projects = computed(() => data.value?.projects ?? [])

// --- Lightbox logic (unchanged) ---
const lightboxOpen = ref(false)
const activeProjectIndex = ref<number | null>(null)
const activeImageIndex = ref(0)

const PROJECT_COLOR_CLASSES = [
  'group-hover:text-[#0986A6]',
  'group-hover:text-[#A55027]',
  'group-hover:text-[#390F7D]',
]

const PROJECT_COLOR_HEX = ['#0986A6', '#A55027', '#390F7D']

const textHoverColor = (i: number) => {
  return PROJECT_COLOR_CLASSES[i % PROJECT_COLOR_CLASSES.length]
}

const gallery = computed(() => {
  if (activeProjectIndex.value == null) return []
  return projects.value?.[activeProjectIndex.value]?.photoGallery?.nodes ?? []
})

function openLightbox(projectIndex: number, startIndex = 0) {
  activeProjectIndex.value = projectIndex
  activeImageIndex.value = startIndex
  lightboxOpen.value = true
  if (process.client) document.documentElement.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  if (process.client) document.documentElement.style.overflow = ''
}

function nextImg() {
  const len = gallery.value.length
  if (!len) return
  activeImageIndex.value = (activeImageIndex.value + 1) % len
}

function prevImg() {
  const len = gallery.value.length
  if (!len) return
  activeImageIndex.value = (activeImageIndex.value - 1 + len) % len
}

function onKey(e: KeyboardEvent) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') nextImg()
  if (e.key === 'ArrowLeft') prevImg()
}

const visibleCount = ref(3)

const visibleProjects = computed(() => {
  return projects.value.slice(0, visibleCount.value)
})

const canShowMore = computed(() => visibleCount.value < projects.value.length)

async function showMore() {
  visibleCount.value = Math.min(
    visibleCount.value + 3,
    projects.value.length
  )

  // wait for DOM to render new projects, then attach parallax
  await nextTick()
  initParallax()

  // Refresh all ScrollTriggers so downstream sections (like testimonials) recalculate their positions
  if (ScrollTrigger) {
    ScrollTrigger.refresh()
  }
}

function initParallax() {
  if (!projectsSection.value || !gsap || !ScrollTrigger || prefersReduced) return

  const thumbs = projectsSection.value.querySelectorAll<HTMLElement>('.project-image img')

  thumbs.forEach((img) => {
    // Avoid creating multiple ScrollTriggers on the same image
    if ((img as any).dataset.parallaxInit === 'true') return
    ;(img as any).dataset.parallaxInit = 'true'

    const triggerEl = img.closest('.project') ?? img

    gsap.fromTo(
      img,
      { yPercent: -10 },
      {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerEl,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          // markers: true,
        },
      }
    )
  })
}

// --- Swipe Detection for Mobile Lightbox ---
let startX = 0
let endX = 0

function onTouchStart(e: TouchEvent) {
  startX = e.touches[0].clientX
}

function onTouchMove(e: TouchEvent) {
  endX = e.touches[0].clientX
}

function onTouchEnd() {
  const diff = endX - startX

  // Adjust threshold depending on your feel
  const threshold = 50

  if (Math.abs(diff) > threshold) {
    if (diff < 0) {
      // Swiped left → next image
      nextImg()
    } else {
      // Swiped right → prev image
      prevImg()
    }
  }

  // Reset for next gesture
  startX = 0
  endX = 0
}

onMounted(async () => {
  window.addEventListener('keydown', onKey)

  if (!process.client) return

  const mod = await import('gsap')
  const st = await import('gsap/ScrollTrigger')

  gsap = mod.gsap
  ScrollTrigger = st.ScrollTrigger
  gsap.registerPlugin(ScrollTrigger)

  prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!projectsSection.value || prefersReduced) return

  initParallax()

  ScrollTrigger.create({
    trigger: projectsSection.value,
    start: 'top top+=80',  // adjust offset to taste
    onEnter() {
      // Scrolling down into projects → hide logo
      isLogoHidden.value = true
    },
    onLeaveBack() {
      // Scrolling back up above projects → show logo again
      isLogoHidden.value = false
    },
  })
})


onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (ScrollTrigger) {
    ScrollTrigger.getAll().forEach((t: any) => t.kill())
  }
})

</script>

<template>
  <section ref="projectsSection" class="projects-section just-container">
    <div class="projects-container res-gutter">
      <div class="projects">
        <div
          v-for="(project, i) in visibleProjects"
          :key="project.projectName ?? i"
          class="project flex group cursor-pointer transition-colors duration-300"
          :class="{
            'flex-row-reverse project--rev': i % 2 === 1,
            'flex-row': i % 2 === 0
          }"
          @click="openLightbox(i, 0)"
        >
          <!-- Project Name -->
          <h3
            class="project-name font-family-accent transition-colors duration-300"
            :class="[
              i % 2 === 1 ? 'text-left' : 'text-right',
              textHoverColor(i)
            ]"
          >
            {{ project.projectName }}
          </h3>

          <!-- Project Meta -->
          <div class="project-meta flex flex-col">
            <div class="project-image relative overflow-hidden">
              <img
                :src="project.featuredImage?.node?.sourceUrl"
                :alt="project.featuredImage?.node?.altText || project.projectName"
                class="inset-0 h-full w-full object-cover"
              />
            </div>

            <div
              class="project-info mt-2"
              :class="i % 2 === 1 ? 'text-left items-start' : 'text-right items-end'"
            >
              <p class="project-location">{{ project.location }}</p>
              <p class="project-year body-font-code">{{ project.year }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-8 show-more-btn relative" v-if="canShowMore">
        <button
          type="button"
          class="inline-flex body-font-code uppercase underline-animation"
          @click="showMore"
        >
          Show more projects
        </button>
      </div>
    </div>

    <!-- LIGHTBOX -->
    <Teleport to="body">
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90"
        aria-modal="true"
        role="dialog"
        @click.self="closeLightbox"
      >
        <!-- Image container (clicks inside here should NOT close) -->
        <div
          class="relative z-10 image-container"
          @click.stop
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <!-- Close button -->
          <button
            class="lightbox-close absolute text-white/90 hover:text-white transition"
            aria-label="Close"
            @click.stop="closeLightbox"
          >
            ✕
          </button>

          <img
            v-if="gallery.length"
            :src="gallery[activeImageIndex]?.sourceUrl"
            :alt="gallery[activeImageIndex]?.altText || 'Project image'"
            class="w-full h-auto max-h-[100vh] object-contain select-none"
          />

          <!-- Prev / Next Controls -->
          <button
            class="carousel-arrow absolute left-0 md:left-4 top-1/2 -translate-y-1/2 px-4 py-3 text-7xl"
            aria-label="Previous image"
            @click.stop="prevImg"
          >
            ‹
          </button>
          <button
            class="carousel-arrow absolute right-0 md:right-4 top-1/2 -translate-y-1/2 px-4 py-3 text-7xl"
            aria-label="Next image"
            @click.stop="nextImg"
          >
            ›
          </button>

          <div
            v-if="gallery.length"
            class="absolute bottom-4 right-4 text-sm text-white/80"
          >
            {{ activeImageIndex + 1 }} / {{ gallery.length }}
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style lang="scss" scoped>
.project {
  @media (min-width: 768px) {
    gap: 30px;
  }

  &-meta {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    top: 45px;
    margin-bottom: 32px;
    width: 100%;
    @media (min-width: 768px) and (max-width: 1499px) {
      top: clamp(31px, calc(31px + 35 * ((100vw - 768px) / (1500 - 768))), 66px);
    }
    @media (min-width: 1500px) {
      top: 66px;
    }
  }

  &-name {
    font-size: clamp(100px, 31vw, 464px);
    flex-shrink: 0;
    line-height: 1.05;
  }

  &-image {
    position: relative;
    overflow: hidden;

    @media (max-width: 767px) {
      width: 100%;
      height: clamp(220px, 55vw, 320px);
    }

    @media (min-width: 768px) {
      top: 8px;
      height: calc(180px + (98 * ((100vw - 768px) / (1175 - 768))));
    }
    @media (min-width: 1175px) {
      height: calc(278px + (75 * ((100vw - 1175px) / (1500 - 1175))));
    }
    @media (min-width: 1500px) {
      height: 353px;
    }

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 120%;
      object-fit: cover;
      transform-origin: center center;
      will-change: transform;
      transition: transform 220ms ease-out; // keep your hover niceness
    }
  }

  &-info {
    display: flex;
    flex-direction: column;
    margin-top: 0.75rem;
  }

  &-location {
    font-size: 18px;
    @media (min-width: 768px) {
      font-size: clamp(19px, 2.45vw, 22px);
    }
  }

  &-year {
    text-transform: uppercase;
    font-size: 16px;
    @media (min-width: 768px) {
      font-size: clamp(16px, 2vw, 18px);
    }
  }
}

@media (max-width: 767px) {
  .project {
    flex-direction: column;
    align-items: flex-start;
    .project-name {
      font-size: clamp(140px, 20vw, 260px);
      position: relative;
      top: 42px;
    }
  }
}

.show-more-btn {
  font-size: 24px;
  @media (max-width: 767px) {
    font-size: 18px;
  }
}

.image-container {
  width: calc(100% - 24px);
}

.carousel-arrow {
  color: var(--accent-color-pink);
  @media (max-width: 767px) {
    font-size: 2.5rem;
  }
}

.lightbox-close {
  right: 0.75rem;
  top: 0.25rem;
  font-size: 22px;
  @media (min-width: 768px) {
    font-size: 30px;
  }
}

</style>
