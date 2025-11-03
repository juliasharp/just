<script setup lang="ts">
import { ref, nextTick } from 'vue'
import AccordionMinus from '~/public/accordion-minus.svg?component'

const config = useRuntimeConfig()
const query = `
  query NewQuery {
    page(id: "234", idType: DATABASE_ID) {
      residentialLp {
        whyJustHeader
        whyJust {
          heading
          bulletPoint {
            bulletPoint
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
      whyJustHeader: d.data.page.residentialLp.whyJustHeader,
      whyJust: d.data.page.residentialLp.whyJust || []
    }
  }
})

if (error.value) {
  console.error('Error fetching residential projects data:', error.value)
}

const openIndex = ref<number>(-1)

/**
 * We’ll store refs to each content panel so we can animate height
 */
const contentRefs = ref<Array<HTMLElement | null>>([])

function toggleAccordion(index: number) {
  const isCurrentlyOpen = openIndex.value === index
  const newIndex = isCurrentlyOpen ? -1 : index

  // If we're closing the currently open panel
  if (isCurrentlyOpen) {
    const el = contentRefs.value[index]
    if (el) {
      const startHeight = el.scrollHeight
      el.style.height = startHeight + 'px'
      // force reflow so browser registers startHeight
      el.offsetHeight
      el.style.height = '0px'
    }
    openIndex.value = -1
    return
  }

  // Otherwise we're opening a new panel.
  // 1. Close the previously open one (if any).
  if (openIndex.value !== -1) {
    const prev = openIndex.value
    const prevEl = contentRefs.value[prev]
    if (prevEl) {
      const prevStartHeight = prevEl.scrollHeight
      prevEl.style.height = prevStartHeight + 'px'
      prevEl.offsetHeight
      prevEl.style.height = '0px'
    }
  }

  // 2. Open the clicked panel.
  openIndex.value = newIndex

  const el = contentRefs.value[newIndex]
  if (!el) return

  // measure target height
  el.style.height = 'auto'
  const targetHeight = el.scrollHeight
  el.style.height = '0px'

  nextTick(() => {
    el.style.height = targetHeight + 'px'
  })

  const onEnd = (e: TransitionEvent) => {
    if (e.propertyName !== 'height') return
    // lock to auto ONLY if this panel is still the open one
    if (openIndex.value === newIndex) {
      el.style.height = 'auto'
    }
    el.removeEventListener('transitionend', onEnd)
  }
  el.addEventListener('transitionend', onEnd)
}

watch(
  () => data.value?.whyJust,
  (list) => {
    if (!list) return
    // ensure the array of refs is the right length
    contentRefs.value = list.map((_, i) => contentRefs.value[i] || null)

    // collapse everything initially
    nextTick(() => {
      contentRefs.value.forEach((el) => {
        if (!el) return
        el.style.height = '0px'
        el.style.transition = 'height 400ms'
      })
    })
  },
  { immediate: true }
)
</script>

<template>
  <section class="why-just-section">
    <div class="why-just-container flex">
      <div class="left">
        <h2 class="why-just-header">
          {{ data?.whyJustHeader }}
        </h2>
      </div>

      <div class="right">
        <div
          v-for="(item, i) in data?.whyJust"
          :key="i"
          class="why-just"
        >
          <!-- TOGGLE HEADER -->
          <div
            class="why-just-item accordion-toggle"
            :class="{ 'is-open': openIndex === i }"
            @click="toggleAccordion(i)"
          >
            <h3 class="why-just-item-header body-font-bold">
              {{ item.heading }}
            </h3>

            <div class="accordion-icon">
              <!-- first minus: rotates when open -->
              <div
                class="accordion-minus is-vertical"
                :style="{
                  transform: openIndex === i ? 'rotate(0deg)' : 'rotate(-90deg)'
                }"
              >
                <AccordionMinus />
              </div>

              <!-- second minus: stays static -->
              <div class="accordion-minus">
                <AccordionMinus />
              </div>
            </div>
          </div>

          <!-- CONTENT PANEL -->
          <div
            class="accordion-content overflow-hidden"
            ref="contentRefs"
            :style="{
              // openIndex controls if this one is expanded
              height: openIndex === i ? 'auto' : '0px',
              transition: 'height 400ms'
            }"
          >
            <ul class="why-just-item-list">
              <li
                class="why-just-item-list-item"
                v-for="(bullet, j) in item.bulletPoint"
                :key="j"
              >
                {{ bullet.bulletPoint }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.accordion-minus {
  display: flex;
  width: .75em;
}
</style>
