<script setup>

const props = defineProps({
  title: String,
  pageName: String
});

const showContactForm = ref(false);

onMounted(() => {
  const logo = document.querySelector('.logo');
  const mailButton = document.querySelector('.mail-button');

  gsap.set([logo, mailButton], { autoAlpha: 0 });

  ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 2,
  });

  // ScrollTrigger.create({
  //   trigger: '.header-container',
  //   start: 'top top',
  //   end: 'bottom bottom',
  //   onEnter: () => {
  //     gsap.to([logo, mailButton], { autoAlpha: 0, duration: 0.5 });
  //   },
  //   onLeaveBack: () => {
  //     gsap.to([logo, mailButton], { autoAlpha: 1, duration: 0.5 });
  //   },
  //   onUpdate: (self) => {
  //     if (self.direction === -1 && !self.isActive) {
  //       gsap.to([logo, mailButton], { autoAlpha: 1, duration: 0.5 });
  //     } else if (self.direction === 1 && !self.isActive) {
  //       gsap.to([logo, mailButton], { autoAlpha: 0, duration: 0.5 });
  //     }
  //   }
  // });

  ScrollTrigger.create({
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      if (self.direction === -1) {
        gsap.to([logo, mailButton], { autoAlpha: 1, duration: 0.5 });
      } else {
        gsap.to([logo, mailButton], { autoAlpha: 0, duration: 0.5 });
      }
    }
  });
})

</script>

<template>
  <div id="viewport" :class="`page ${props.pageName}`">
    <LogoNav v-model:showForm="showContactForm"/>
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <slot />
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