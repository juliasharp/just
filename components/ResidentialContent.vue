<script setup lang="ts">
let gsap: any
let ScrollTrigger: any

const config = useRuntimeConfig();
const query = `
  query NewQuery {
    page(id: "234", idType: DATABASE_ID) {
      residentialLp {
        justHomePrefix
        justHomeSuffix {
          suffix
        }
      }
    }
  }
`;

const { data, error } = await useFetch(config.public.wordpressUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: { query },
  transform: (d: any) => ({
    justHomePrefix: d?.data?.page?.residentialLp?.justHomePrefix ?? 'A JUST home is',
    justHomeSuffix: d?.data?.page?.residentialLp?.justHomeSuffix ?? [
      { suffix: 'built to last' },
      { suffix: 'crafted with care' },
      { suffix: 'inspired by you' }
    ]
  })
})
if (error.value) console.error('Error fetching residential hero data:', error.value)

const suffixContainer = ref<HTMLElement | null>(null)
const extended = computed(() => {
  const arr = (data.value?.justHomeSuffix ?? []).map((x: any) => x?.suffix).filter(Boolean)
  return arr.length ? [...arr, arr[0]] : []
})
const sectionEl = ref<HTMLElement | null>(null)


let tl: any
let pinTrigger: any

onMounted(async () => {
  const mod = await import('gsap')
  gsap = mod.gsap

  // --- text loop animation (unchanged) ---
  const suffixEls = suffixContainer.value?.querySelectorAll<HTMLElement>('.suffix-item')
  if (!suffixEls || suffixEls.length <= 1) return

  gsap.set(suffixEls, { yPercent: (i) => i * 100 })

  tl = gsap.timeline({
    defaults: { ease: 'power2.inOut', duration: 1.0 },
    repeat: -1
  })
  const dwell = 1.2

  for (let i = 0; i < suffixEls.length - 1; i++) {
    tl.to(suffixEls, { yPercent: '-=100' }, `+=${dwell}`)
  }

  tl.add(() => {
    gsap.set(suffixEls, { yPercent: (i) => i * 100 })
  })

  // --- pin / lock section for a short distance ---
  if (typeof window !== 'undefined') {
    const { ScrollTrigger: ST } = await import('gsap/ScrollTrigger')
    ScrollTrigger = ST
    gsap.registerPlugin(ScrollTrigger)

    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    if (isDesktop && sectionEl.value) {
      pinTrigger = ScrollTrigger.create({
        trigger: sectionEl.value,
        start: 'top top',
        pin: true,
        pinSpacing: true,
        // Controls how long it stays pinned. Increase/decrease this value
        // for a longer/shorter "few seconds" feel.
        //end: '+=900', // ~900px of scroll
      })
    }
  }
})

onBeforeUnmount(() => {
  tl?.kill()
  pinTrigger?.kill?.()
})
</script>


<template>
  <section
    ref="sectionEl"
    class="snap-section snap-panel content-section just-container px-6 pt-[7rem] pb-[7rem] md:pt-[13rem] md:pb-[15rem] xl:pt-[19rem] xl:pb-[21rem] overflow-hidden"
  >
    <div class="a-just-home-is-text flex justify-center flex-col items-center">
      <!-- Prefix -->
      <h2 class="whitespace-nowrap">
        A <span class="body-font-bold">JUST</span> home is...
      </h2>

      <!-- Suffix animation -->
      <div
        ref="suffixContainer"
        class="relative h-[1.2em] overflow-hidden leading-tight suffix-container"
      >
        <div
          v-for="(item, i) in extended"
          :key="i"
          class="suffix-item absolute top-0 left-0 w-full body-font-medium"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </section>
</template>


<style scoped lang="scss">
.suffix-container {
  width: 100%;
  //border-bottom: 2px solid black;
  position: relative;
}

.a-just-home-is-text {
  font-size: clamp(26px, 5.375vw, 42px);
  gap: 0;
  text-align: center;
  width: 100%;
  line-height: 1.3;
  @media (min-width: 768px) {
    font-size: clamp(40px, 4.5vw, 75px);
  }
}

.content-section {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
