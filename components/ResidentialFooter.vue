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
    <div class="footer-contact-text res-gutter py-[4rem]">
      <p class="body-font-medium text-center relative">For more in depth information about our design phases and process, <button @click = "showContact" class="underline-animation">download your free design guide now!</button></p>
    </div>
    <div class="footer-links flex justify-between res-gutter">
      <div class="footer-links-left">
        <a href="https://www.instagram.com/__justdesign/" target="_blank">Instagram.</a>
        <a href="https://www.linkedin.com/company/just-design-inc/" target="_blank">LinkedIn.</a>
        <a href="mailto:info@just.design">Contact.</a>
      </div>
      <div class="footer-links-right">
        <p>Copyright © 2025. JUST Design.</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.footer {
  &-contact-text {
    font-size: 24px;
    line-height: 1.22;
    @media (min-width: 768px) {
      max-width: 70vw;
      margin: 0 auto;
      font-size: clamp(25px, 2.6vw, 40px);
    }
  }
  &-links {
    padding-top: 20px;
    padding-bottom: 20px;
    @media (max-width: 767px) {
      flex-direction: column;
      align-items: center;
    }
    &-left {
      @media (max-width: 767px) {
        margin-bottom: 8px;
      }
      a {
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