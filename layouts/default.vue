<script setup>

const props = defineProps({
  title: String,
  pageName: String
});

const showContactForm = ref(false);

onMounted(() => {
  ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 2,
  });
})

</script>

<template>
  <div id="viewport" :class="`page ${props.pageName}`">
    <LogoNav v-model:showForm="showContactForm"/>
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <!-- <div class="page-inner m-auto"> -->
          <slot />
        <!-- </div> -->
        <Footer v-model:showForm="showContactForm"></Footer>
        <FooterImage />
      </div>
    </div>
    <ContactForm v-if="showContactForm" v-model:showForm="showContactForm"/>
    <div v-if="showContactForm" class="overlay"></div>
  </div>
</template>

<style lang="scss">
@import url("https://use.typekit.net/jih0gxf.css");
#smooth-wrapper {
  overflow: hidden !important;
}
.overlay {
  position: fixed;
  inset: 0px;
  height: 100%;
  width: 100%;
  z-index: 12;
  background: rgba(240, 240, 238, 0.9);
  transition: opacity 700ms cubic-bezier(0.44, 0.24, 0.16, 1) 0s;
  opacity: 1;
}
</style>