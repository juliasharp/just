<script setup>

const props = defineProps({
  title: String,
  pageName: String
});

const gfFormId = 1

const showContactForm = useContactForm()

const { fields, pending, error } = useGfFormFields(gfFormId)

onMounted(() => {
  document.body.classList.add('residential')
})

onBeforeUnmount(() => {
  document.body.classList.remove('residential')
})

</script>

<template>
  <div id="viewport" :class="`page ${props.pageName}`">
    <slot />
    <Teleport to="body">
      <!-- Keep mounted; panel slides via its own .is-shown class -->
      <ContactForm 
        v-model:showForm="showContactForm" 
        bgColor="#390F7D"
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
    <div v-if="showContactForm" class="overlay" @click="showContactForm = false"></div>
  </div>
</template>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  inset: 0px;
  height: 100%;
  width: 100%;
  z-index: 12;
  background: rgba(240, 240, 238, 0.6);
  transition: opacity 700ms cubic-bezier(0.44, 0.24, 0.16, 1) 0s;
  opacity: 1;
}</style>