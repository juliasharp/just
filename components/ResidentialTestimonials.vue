<script setup lang="ts">
let gsap: any
let ScrollTrigger: any

const config = useRuntimeConfig();
const query = `
  query NewQuery {
    page(id: "234", idType: DATABASE_ID) {
      residentialLp {
       quote {
          quote
          author
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
      testimonials: data.data.page.residentialLp.quote
    }
  }
})

if (error.value) {
  console.error('Error fetching residential projects data:', error.value);
}

const testimonials = computed(() => data.value?.testimonials || [])

const settings = {
  itemsToShow: 1,
  autoplay: 8000,
  wrapAround: true,
  easing: "linear",
  transition: 400,
  mouseDrag: false,
  touchDrag: true,
}

const sectionEl = ref<HTMLElement | null>(null)
let pinTrigger: any

onMounted(async () => {
  const mod = await import('gsap')
  gsap = mod.gsap

  // --- pin / lock section for a short distance ---
  if (typeof window !== 'undefined') {
    const { ScrollTrigger: ST } = await import('gsap/ScrollTrigger')
    ScrollTrigger = ST
    gsap.registerPlugin(ScrollTrigger)

    if (sectionEl.value) {
      pinTrigger = ScrollTrigger.create({
        trigger: sectionEl.value,
        start: 'top top',
        pin: true,
        pinSpacing: true,
      })
    }
  }
})

onBeforeUnmount(() => {
  pinTrigger?.kill?.()
})
</script>

<template>
  <section ref="sectionEl" class="testimonial-section snap-section snap-panel">
    <!-- Full-height flexbox to center the stage -->
    <div class="h-full flex items-center justify-center">
      <!-- Stage: controls max width + horizontal padding -->
      <div class="res-gutter max-w-[1100px] w-full mx-auto text-center relative">
        <!-- Transition group sits inside the stage -->
        <Carousel v-bind="settings">
          <Slide
            v-for="(item, i) in testimonials"
            :key="i"
            class="testimonial-slide"
          >
            <transition name="fade"  mode="out-in">
              <div
                class="flex flex-col items-center text-center"
              >
                <blockquote
                  class="testimonial body-font-medium max-w-[70ch] mx-auto transition-all"
                >
                  {{ item.quote }}
                </blockquote>

                <p class="testimonial-author uppercase body-font-bold">
                  — {{ item.author }}
                </p>
              </div>
            </transition>
          </Slide>
        </Carousel>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.testimonial-section {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 767px) {
    height: 100dvh;
  }
}

.testimonial {
  display: block;
  font-size: clamp(24px, 3.5vw, 52px);
  line-height: 1.2;
  &-container {
    width: 70vw;
  }
  &-author {
    padding-top: 52px;
    letter-spacing: 0.02em;
    @media (max-width: 767px) {
      font-size: 16px;
    }
  }
}
</style>
