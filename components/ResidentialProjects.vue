<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed, ref } from 'vue'

const {
  public: {
    wordpressUrl,
    residentialUri = '/residential',              // set per-env
    residentialPageId = ''                        // optional fallback
  }
} = useRuntimeConfig()

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
  // Try URI first
  try {
    const res: any = await $fetch(wordpressUrl, {
      method: 'POST',
      body: { query: QUERY_BY_URI, variables: { uri: residentialUri } }
    })
    const page = res?.data?.page ?? null
    if (page) {
      return {
        page,
        projects: (page.residentialLp?.projects ?? []) as GqlProject[],
      }
    }
  } catch (e) {
    console.error('Residential (URI) fetch failed', e)
  }

  // Fallback to DB ID if provided (useful for local)
  if (residentialPageId) {
    try {
      const res: any = await $fetch(wordpressUrl, {
        method: 'POST',
        body: { query: QUERY_BY_ID, variables: { id: residentialPageId } }
      })
      const page = res?.data?.page ?? null
      return {
        page,
        projects: (page?.residentialLp?.projects ?? []) as GqlProject[],
      }
    } catch (e) {
      console.error('Residential (ID) fetch failed', e)
    }
  }

  // Final safe fallback
  return { page: null, projects: [] as GqlProject[] }
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

const textHoverColor = (i: number) => {
  const colors = ['group-hover:text-[#0986A6]', 'group-hover:text-[#A55027]', 'group-hover:text-[#390F7D]']
  return colors[i % colors.length]
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

function showMore() {
  visibleCount.value = Math.min(
    visibleCount.value + 3,
    projects.value.length
  )
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <section class="projects-section">
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
      >
        <!-- Click to close area -->
        <div class="absolute inset-0" @click="closeLightbox"></div>

        <!-- Image -->
        <div class="relative z-10 image-container">
          <!-- Close button -->
          <button
            class="absolute -top-12 right-0 text-white/90 hover:text-white transition"
            aria-label="Close"
            @click.stop="closeLightbox"
          >
            ✕
          </button>

          <img
            v-if="gallery.length"
            :src="gallery[activeImageIndex]?.sourceUrl"
            :alt="gallery[activeImageIndex]?.altText || 'Project image'"
            class="w-full h-auto max-h-[90vh] object-contain select-none"
          />

          <!-- Prev / Next Controls -->
          <button
            class="carousel-arrow absolute left-4 top-1/2 -translate-y-1/2 px-4 py-3 text-7xl"
            aria-label="Previous image"
            @click.stop="prevImg"
          >
            ‹
          </button>
          <button
            class="carousel-arrow absolute right-4 top-1/2 -translate-y-1/2 px-4 py-3 text-7xl"
            aria-label="Next image"
            @click.stop="nextImg"
          >
            ›
          </button>

          <!-- Counter -->
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
  @media (min-width: 769px) {
    gap: 30px;
  }
  &-meta {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    top: 45px;
    margin-bottom: 32px;
    @media (min-width: 769px)  and (max-width: 1499px) {
      top: clamp(31px, calc(31px + 35 * ((100vw - 769px) / (1500 - 769))), 66px);
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
    @media (max-width: 767px) {
      width: 100%;
      height: auto;
    }
    @media (min-width: 769px) {
      top: 8px;
      height: calc(180px + (98 * ((100vw - 769px) / (1175 - 769))));
    }
    @media (min-width: 1175px) {
      height: calc(278px + (75 * ((100vw - 1175px) / (1500 - 1175))));
    }
    @media (min-width: 1500px) {
      height: 353px;
    }
    img {
      @media (min-width: 769px) {
        position: absolute;
      }
    }
  }
  &-info {
    display: flex;
    flex-direction: column;
    margin-top: 0.75rem;
  }
  &-location {
    font-size: 18px;
    @media (min-width: 769px) {
      font-size: clamp(19px, 2.45vw, 22px)
    }
  }
  &-year {
    text-transform: uppercase;
    font-size: 16px;
    @media (min-width: 769px) {
      font-size: clamp(16px, 2vw, 18px)
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
}

</style>