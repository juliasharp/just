<script setup>
import { useSmoothScroll } from '~/composables/useSmoothScroll';

const props = defineProps({
  title: String,
  pageName: String
});

const showContactForm = ref(false);

// watchEffect(() => {
  // if(!general.isPreloaderVisible) {
  //   headerAnimation({
  //     parent: `.${props.pageName}`
  //   })
  // }
// });

// onMounted(() => {
//   useSmoothScroll()
// })

</script>

<template>
  <div id="viewport" :class="`page ${props.pageName}`">
    <LogoNav v-model:showForm="showContactForm"/>
    <slot />
    <Footer v-model:showForm="showContactForm"></Footer>
    <ContactForm v-if="showContactForm" v-model:showForm="showContactForm"/>
  </div>
</template>

<style lang="scss">
@import url("https://use.typekit.net/jih0gxf.css");
</style>