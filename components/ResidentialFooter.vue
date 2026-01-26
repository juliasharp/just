<script setup lang="ts">

const showContactForm = useContactForm()

function showContact() { showContactForm.value = true }

const config = useRuntimeConfig();
const query = `
  query NewQuery {
    page(id: "234", idType: DATABASE_ID) {
      residentialLp {
        footerImage {
          node {
            altText
            sourceUrl
          }
        }
        footerImageMobile {
          node {
            altText
            sourceUrl
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
      footerImage: data.data.page.residentialLp.footerImage.node,
      footerImageMobile: data.data.page.residentialLp.footerImageMobile.node
    }
  }
});

if (error.value) {
  console.error('Error fetching residential projects data:', error.value);
}

const footerImage = computed(() => data.value?.footerImage)
const footerImageMobile = computed(() => data.value?.footerImageMobile)
const currentYear = new Date().getFullYear()

const isMobile = ref(false)

const update = () => {
  isMobile.value = window.innerWidth <= 760  // or whatever breakpoint you want
}

onMounted(() => {
  update()
  window.addEventListener('resize', update)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', update)
})
</script>

<template>
  <div class="footer-container">
    <div class="footer-image">
      <img v-if=!isMobile :src="footerImage?.sourceUrl" :alt="footerImage?.altText">
      <img v-else :src="footerImageMobile?.sourceUrl" :alt="footerImageMobile?.altText">
    </div>
    <div class="footer-contact-text res-gutter py-[2rem] md:py-[4rem]">
      <p class="body-font-medium text-center relative">For more in depth information about our design phases and process, <button @click = "showContact" class="underline-animation">download your free design guide now!</button></p>
    </div>
    <div class="footer-links flex justify-between res-gutter">
      <div class="footer-links-left">
        <a href="https://www.instagram.com/__justdesign/" target="_blank">Instagram.</a>
        <a href="https://www.linkedin.com/company/just-design-inc/" target="_blank">LinkedIn.</a>
        <a href="mailto:info@just.design">Contact.</a>
      </div>
      <div class="footer-links-right">
        <p>Copyright © {{ currentYear }}. JUST Design.</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.footer {
  &-contact-text {
    font-size: 18px;
    line-height: 1.22;
    @media (min-width: 768px) {
      max-width: 70vw;
      margin: 0 auto;
      font-size: clamp(25px, 2.6vw, 40px);
    }
    button {
      @media (max-width: 760px) {
        text-decoration: underline;     /* use browser underline (multi-line) */
        text-decoration-thickness: 1.5px;
        text-underline-offset: 3px;

        &::after {
          display: none;                /* hide pseudo-element underline */
        }

        &:hover {
          /* subtle micro interaction for mobile (optional) */
          text-underline-offset: 5px;
          text-decoration-thickness: 2px;
        }
      }
    }
  }
  &-links {
    padding-top: 20px;
    padding-bottom: 20px;
    @media (max-width: 767px) {
      flex-direction: column;
      align-items: center;
      font-size: 16px;
    }
    &-left {
      @media (max-width: 767px) {
        margin-bottom: 8px;
      }
      a {
        position: relative;
        &:before {

        }
        &:not(:last-child) {
          margin-right: 30px;
        }
      }
    }
    &:before {
      content: '';
      display: block;
      width: calc(100% - 40px);
      left: 20px;
      height: 1px;
      background: #000;
      position: absolute;
      top: 0;
      @media (min-width: 768px) {
        width: calc(100% - 60px);
        left: 30px;
      }
    }
  }
}
</style>