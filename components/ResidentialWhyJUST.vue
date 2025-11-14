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
        imageRight {
          node {
            altText
            sourceUrl
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
      whyJust: d.data.page.residentialLp.whyJust || [],
      imageRight: d.data.page.residentialLp.imageRight
    }
  }
})

if (error.value) {
  console.error('Error fetching residential projects data:', error.value)
}

// ✅ Default open first section
const openIndex = ref<number>(0)

const contentRefs = ref<Array<HTMLElement | null>>([])

function toggleAccordion(index: number) {
  const isCurrentlyOpen = openIndex.value === index
  const newIndex = isCurrentlyOpen ? -1 : index

  // Close current
  if (isCurrentlyOpen) {
    const el = contentRefs.value[index]
    if (el) {
      const startHeight = el.scrollHeight
      el.style.height = startHeight + 'px'
      el.offsetHeight
      el.style.height = '0px'
    }
    openIndex.value = -1
    return
  }

  // Close previously open
  if (openIndex.value !== -1) {
    const prevEl = contentRefs.value[openIndex.value]
    if (prevEl) {
      const prevStartHeight = prevEl.scrollHeight
      prevEl.style.height = prevStartHeight + 'px'
      prevEl.offsetHeight
      prevEl.style.height = '0px'
    }
  }

  // Open new one
  openIndex.value = newIndex

  const el = contentRefs.value[newIndex]
  if (!el) return

  el.style.height = 'auto'
  const targetHeight = el.scrollHeight
  el.style.height = '0px'

  nextTick(() => {
    el.style.height = targetHeight + 'px'
  })

  const onEnd = (e: TransitionEvent) => {
    if (e.propertyName !== 'height') return
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
    contentRefs.value = list.map((_, i) => contentRefs.value[i] || null)

    nextTick(() => {
      contentRefs.value.forEach((el, i) => {
        if (!el) return
        el.style.transition = 'height 400ms'

        // ✅ Collapse all, but open the first
        if (i === 0) {
          el.style.height = 'auto' // keep first one open
        } else {
          el.style.height = '0px'
        }
      })
    })
  },
  { immediate: true }
)
</script>

<template>
  <section class="why-just-section">
    <div class="why-just-container flex res-gutter">
      <div class="left">
        <h2 class="why-just-header body-font-bold">
          {{ data?.whyJustHeader }}
        </h2>

        <div class="accordion-wrap">

          <div
            v-for="(item, i) in data?.whyJust"
            :key="i"
            class="why-just"
          >
            <!-- TOGGLE HEADER -->
            <div
              class="why-just-item accordion-toggle flex align-center"
              :class="{ 'is-open': openIndex === i }"
              @click="toggleAccordion(i)"
            >
              <h3 class="why-just-item-header body-font">
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
              <div class="accordion-content-inner">
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
      </div>

      <div class="right">
        <img
          v-if="data?.imageRight?.node?.sourceUrl"
          :src="data.imageRight.node.sourceUrl"
          :alt="data.imageRight.node.altText"
          class="why-just-image"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">

.why-just {
  @media (min-width: 769px) {
    font-size: 17px;
  }
  @media (min-width: 1181px) {
    font-size: 18px;
  }
  &-container {
    @media (max-width: 767px) {
      flex-direction: column-reverse;
    }
    @media (min-width: 769px) {
      margin-bottom: 80px;
    }
    @media (min-width: 1181px) {
      margin-bottom: 120px;
    }
    .left {
      flex-basis: 50%;
      @media (max-width: 767px) {
        margin-top: 50px;
      }
    }

    .right {
      @media (min-width: 769px) {
        max-width: 36vw;
      }
      @media (min-width: 1181px) {
        max-width: 34vw;
      }
      margin-left: auto;
    }
  }
  &-header {
    font-size: clamp(22px, 2.5vw, 40px);
  }
  &-item {
    justify-content: space-between;
    border-top: 1px solid #272520b3;
    &-header {
      text-transform: none;
      width: 100%;
      padding-top: 1em;
      padding-bottom: 1em;
      padding-right: 1.5em;
    }
  }
  &-item {
    &-list {
      margin-top: 0;
      margin-bottom: 0;
      padding-left: 2.25em;
      li {
        margin-bottom: 0.25em;
        &:before {
          content: '\2022';
          color: #000;
          font-weight: bold;
          display: inline-block;
          width: 1em;
          margin-left: -1em;
        }
      }
    }
  }
}

.accordion {
  &-wrap {
    border-bottom: 1px solid #272520b3;
    width: 100%;
    margin-top: 50px;
  }
  &-content-inner {
    padding-top: 0.5em;
    padding-bottom: 1.5em;
    padding-right: 1em;
    @media (min-width: 769px) {
      padding-right: 2em;
    }
    @media (min-width: 1181px) {
      padding-right: 5em;
    }
  }
  &-icon {
    justify-content: center;
    align-items: center;
    display: flex;
    position: relative;
  }
  &-minus {
    justify-content: center;
    align-items: center;
    width: .75em;
    display: flex;
    &.is-vertical {
      transition: transform .2s ease-out;
      position: absolute;
      transform: rotate(-90deg);
    }
  }
}
</style>
