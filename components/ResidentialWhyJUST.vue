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

const openStates = ref<boolean[]>([])

watch(
  () => data.value?.whyJust,
  (list) => {
    if (!list) return
    openStates.value = list.map((_, i) => i === 0) // first open
  },
  { immediate: true }
)

function isOpen(index: number) {
  return !!openStates.value[index]
}

function toggleAccordion(index: number) {
  openStates.value[index] = !openStates.value[index]
}

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
              :class="{ 'is-open': isOpen(i) }"
              @click="toggleAccordion(i)"
            >
              <h3 class="why-just-item-header body-font-medium">
                {{ item.heading }}
              </h3>

              <div class="accordion-icon">
                <!-- first minus: rotates when open -->
                <div
                  class="accordion-minus is-vertical"
                  :style="{
                    transform: isOpen(i) ? 'rotate(0deg)' : 'rotate(-90deg)'
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
              :style="{
                height: isOpen(i) ? 'auto' : '0px',
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
    cursor: pointer;
    &-header {
      text-transform: none;
      width: 100%;
      padding-top: 1em;
      padding-bottom: 1em;
      padding-right: 1.5em;
      font-size: 17px;
      @media (min-width: 769px) {
        font-size: 19px;
      }
      @media (min-width: 1181px) {
        font-size: 22px;
      }
      @media (min-width: 1801px) {
        font-size: 23px;
      }
    }
  }
  &-item {
    &-list {
      margin-top: 0;
      margin-bottom: 0;
      padding-left: 1.5em;
      @media (min-width: 769px) {
        padding-left: 1.75em;
      }
      @media (min-width: 1181px) {
        padding-left: 2.25em;
      }
      li {
        margin-bottom: 0.25em;
        font-size: 17px;
        @media (min-width: 769px) {
          font-size: 18px;
        }
        @media (min-width: 1181px) {
          font-size: 20px;
        }
        @media (min-width: 1801px) {
          font-size: 22px;
        }
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
    margin-top: 25px;
    @media (min-width: 999px) {
      margin-top: 50px;
    }
  }
  &-content-inner {
    padding-top: 0.5em;
    padding-bottom: 1.5em;
    padding-right: 1em;
    @media (min-width: 769px) {
      padding-right: 2em;
    }
    @media (min-width: 1181px) {
      padding-right: 3em;
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
      transform: rotate(-90deg) translateZ(0);
      will-change: transform;
    }
  }
}
</style>
