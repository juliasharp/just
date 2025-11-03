<script setup lang="ts">

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

// --- FADER LOGIC ---
const current = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const testimonials = computed(() => data.value?.testimonials || [])
const total = computed(() => testimonials.value.length)

const next = () => {
  if (!total.value) return
  current.value = (current.value + 1) % total.value
}

onMounted(() => {
  timer = setInterval(next, 5000) // every 5s
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <section class="testimonial-section h-[100dvh] overflow-hidden">
    <!-- Full-height flexbox to center the stage -->
    <div class="h-full flex items-center justify-center">
      <!-- Stage: controls max width + horizontal padding -->
      <div class="res-gutter max-w-[1100px] w-full mx-auto text-center relative">
        <!-- Transition group sits inside the stage -->
        <transition-group
          name="fade"
          tag="div"
          class="relative w-full"
        >
          <div
            v-for="(item, i) in testimonials"
            :key="i"
            v-show="i === current"
            class="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center"
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
        </transition-group>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.testimonial {
  display: block;
  font-size: clamp(22px, 3.5vw, 52px);
  line-height: 1.2;
  &-container {
    width: 70vw;
  }
  &-author {
    padding-top: 52px;
    letter-spacing: 0.02em;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>