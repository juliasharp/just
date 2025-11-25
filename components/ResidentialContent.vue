<script setup lang="ts">
let gsap: any

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

let tl: any


onMounted(async () => {
  const mod = await import('gsap')
  gsap = mod.gsap

  const suffixEls = suffixContainer.value?.querySelectorAll<HTMLElement>('.suffix-item')
  if (!suffixEls || suffixEls.length <= 1) return

  // stack each row vertically
  gsap.set(suffixEls, { yPercent: (i) => i * 100 })

  // build the loop: step to each next row (last step lands on the CLONE)
  tl = gsap.timeline({ defaults: { ease: 'power2.inOut', duration: 1.0 }, repeat: -1 })
  const dwell = 1.2 // visible time per word

  for (let i = 0; i < suffixEls.length - 1; i++) {
    tl.to(suffixEls, { yPercent: '-=100' }, `+=${dwell}`)
  }

  // we've arrived at the CLONE of first; snap back to the real first row instantly
  tl.add(() => {
    gsap.set(suffixEls, { yPercent: (i) => i * 100 })
  })
})

onBeforeUnmount(() => tl?.kill())
</script>


<template>
  <section class="content-section px-6 pt-[7rem] pb-[7rem] md:pt-[13rem] md:pb-[15rem] xl:pt-[19rem] xl:pb-[21rem] overflow-hidden">
    <div class="a-just-home-is-text flex justify-center flex-row gap-4 sm:gap-6 items-start sm:items-center">
      <!-- Prefix -->
      <h2 class="whitespace-nowrap">
        A <span class="body-font-bold">JUST</span> home is
      </h2>

      <!-- Suffix animation -->
      <div
        ref="suffixContainer"
        class="relative h-[1.2em] overflow-hidden leading-tight body-font-bold suffix-container"
      >
        <div
          v-for="(item, i) in extended"
          :key="i"
          class="suffix-item absolute top-0 left-0 w-full"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.suffix-container {
  width: 168px;
  border-bottom: 2px solid black;
  position: relative;
  bottom: -2.5px;
  @media (min-width: 768px) {
    width: 346px;
    bottom: 1px;
  }
  @media (min-width: 1021px) {
    width: 400px;
  }
  @media (min-width: 1281px) {
    width: 632px;
  }
}

.a-just-home-is-text {
  font-size: 21px;
  @media (min-width: 768px) {
    font-size: 40px;
  }
  @media (min-width: 1021px) {
    font-size: 50px;
  }
  @media (min-width: 1281px) {
    font-size: 76px;
  }
}
</style>