<script setup lang="ts">
const config = useRuntimeConfig()

const query = `
  query NewQuery {
    page(id: "435", idType: DATABASE_ID) {
      emptyChair {
        footerScrollingText
        footerSectionTitle
        textLeft
        chairImage {
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
      footerScrollingText: d?.data?.page?.emptyChair?.footerScrollingText,
      footerSectionTitle: d?.data?.page?.emptyChair?.footerSectionTitle,
      textLeft: d?.data?.page?.emptyChair?.textLeft,
      chairImage: d?.data?.page?.emptyChair?.chairImage?.node ?? null,
    }
  }
})

const showContactForm = useContactForm()
</script>


<template>
  <div class="emptychair-footer">
    <div class="ec-container">
      <h2 class="footer-section-title ec-section-title">{{ data?.footerSectionTitle }}</h2>
        <div v-if="data?.textLeft" class="footer-text body-font-bold">
          <div v-html="data.textLeft"></div>
          <p>Reach out to us <button class="contact-link" @click="showContactForm = true">HERE</button>.</p>
        </div>
        <div v-if="data?.chairImage" class="chair-image">
          <img
            :src="data.chairImage.sourceUrl"
            :alt="data.chairImage.altText || 'Empty Chair Footer Image'"
            class="chair-img"
            decoding="async"
          />
        </div>
    </div>
    <ScrollingText v-if="data?.footerScrollingText" :text="data.footerScrollingText" class="footer-scrolling-text"/>
    <FooterLinks class="footer-links" color="#ffffff" />
  </div>
</template>

<style scoped lang="scss">
.footer-section-title {
  grid-column: 1 / -1;
}

.footer {
  &-text {
    grid-column: 2 / 12;
    align-self: center;
    font-size: 20px;
    @media (min-width: 768px) {
      font-size: 24px;
    }
    @media (min-width: 1200px) {
      font-size: 28px;
    }
    @media (min-width: 1600px) {
      font-size: 35px;
    }
    p {
      margin-top: 30px;
    }
  }
  &-scrolling-text {
    margin-top: 50px;
  }
  &-links {
    margin-top: 30px;
    @media (min-width: 768px) {
      margin-top: 50px;
    }
  }
}

.chair-image {
  grid-column: 18 / 24;
  align-self: center;
  @media (max-width: 767px) {
    grid-column: 1 / -1;
    max-width: 280px;
    margin: 30px auto;
  }
}

.chair-img {
  width: 100%;
  height: auto;
  display: block;
}

.contact-link {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  color: var(--accent-color-yellow);
  text-decoration: underline;
  text-underline-offset: 4px;
}
</style>