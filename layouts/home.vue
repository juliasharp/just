<script setup>

const props = defineProps({
  title: String,
  pageName: String
});

const gfFormId = 2

const showContactForm = useContactForm()

const { fields, pending, error } = useGfFormFields(gfFormId)

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
    <SansLogoNav v-model:showForm="showContactForm"/>
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <slot />
      </div>
    </div>
    <Teleport to="body">
      <!-- Keep mounted; panel slides via its own .is-shown class -->
      <ContactForm 
        v-model:showForm="showContactForm" 
        :gfFormId="gfFormId"
        :passed-fields="fields || []"
      />
      <!-- Overlay fades in/out -->
      <Transition name="fade-fast">
        <div
          v-show="showContactForm"
          class="overlay"
          @click="showContactForm = false"
        />
      </Transition>
    </Teleport>
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