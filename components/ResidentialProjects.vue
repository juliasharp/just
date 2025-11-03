<script setup lang="ts">
const config = useRuntimeConfig();
const query = `
  query NewQuery {
    page(id: "234", idType: DATABASE_ID) {
      residentialLp {
        projects {
          featuredImage {
            node {
              altText
              sourceUrl
            }
          }
          location
          projectName
          year
          photoGallery {
            nodes {
              altText
              sourceUrl
            }
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
  transform: (data: any) => {
    return {
      projects: data.data.page.residentialLp.projects
    }
  }
})

if (error.value) {
  console.error('Error fetching residential projects data:', error.value);
}

const lightboxOpen = ref(false)
const activeProjectIndex = ref<number | null>(null)
const activeImageIndex = ref(0)

const textHoverColor = (i: number) => {
  const colors = [
    'group-hover:text-[#0986A6]', // teal
    'group-hover:text-[#A55027]', // brown
    'group-hover:text-[#390F7D]'  // violet
  ]
  return colors[i % colors.length]
}

const gallery = computed(() => {
  if (activeProjectIndex.value == null) return []
  return data.value?.projects?.[activeProjectIndex.value]?.photoGallery?.nodes ?? []
})

function openLightbox(projectIndex: number, startIndex = 0) {
  activeProjectIndex.value = projectIndex
  activeImageIndex.value = startIndex
  lightboxOpen.value = true
  document.documentElement.style.overflow = 'hidden' // lock scroll
}

function closeLightbox() {
  lightboxOpen.value = false
  document.documentElement.style.overflow = '' // unlock scroll
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

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <section class="projects-section">
    <div class="projects-container res-gutter">
      <div class="projects">
        <div
          v-for="(project, i) in data.projects"
          :key="project.projectName"
          class="project flex items-center gap-[30px] group cursor-pointer transition-colors duration-300"
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
                class="absolute inset-0 h-full w-full object-cover"
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
        <div class="relative z-10 w-full max-w-6xl">
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
            class="absolute left-4 top-1/2 -translate-y-1/2 px-4 py-3 text-white/80 hover:text-white text-4xl"
            aria-label="Previous image"
            @click.stop="prevImg"
          >
            ‹
          </button>
          <button
            class="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-3 text-white/80 hover:text-white text-4xl"
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
  gap: 30px;
  &-meta {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    top: 35px;
  }
  &-name {
    font-size: clamp(100px, 31vw, 464px);
    flex-shrink: 0;
    line-height: 1.05;
  }
  &-image {
    height: 353px;
    position: relative;
    top: 8px;
  }
  &-info {
    display: flex;
    flex-direction: column;
    margin-top: 0.75rem;
  }
  &-location {
    font-size: 22px;
  }
  &-year {
    text-transform: uppercase;
  }
}

@media (max-width: 768px) {
  .project {
    flex-direction: column !important;
    text-align: left !important;
    .project-image { top: 0; height: 260px; }
    .project-name { font-size: clamp(56px, 20vw, 120px); }
  }
}

</style>