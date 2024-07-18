<script setup lang="ts">
import IconClose from '/src/icon-close.svg?component';

const props = defineProps({
	showForm: {
		type: Boolean,
		default: true
	}
});

const emit = defineEmits<{
  (e: 'update:showForm', value: boolean): void;
}>();

const isShown = computed({
  get() {
    return props.showForm;
  },
  set(value: boolean) {
    emit('update:showForm', value);
  }
});

function closeForm() {
  console.log("close");
  isShown.value = false;
}
</script>

<template>
  <form action="https://formspree.io/f/xjvnonvd" method="POST" class="contact-form">
    <div class="contact-form-header">
      <h3>Hit Me Up</h3>
      <button type="button" class="button button-close" @click="closeForm">
        <div class="button-close">
          <IconClose></IconClose>
        </div>
      </button>
    </div>
    <div class="contact-form-body">
      <label>
        Your email:
        <input type="email" name="email">
      </label>
      <label>
        Your message:
        <textarea name="message"></textarea>
      </label>
      <!-- your other form fields go here -->
      <button type="submit">Send</button>
    </div>
    <div class="contact-form-footer"></div>
  </form>
</template>

<style lang="scss">
.contact-form {
  position: fixed;
  z-index: 999;
  display: flex;
  flex-direction: column;
  top: 0;
  right: 0;
  bottom: 0;
  background: #0a0aa6;
  color: white;
  transition: transform 700ms cubic-bezier(0.44, 0.24, 0.16, 1);
  // transform: translate3d(110%, 0, 0);
  @media (min-width: 1024px) {
    width: calc(340px + 17vw);
  }
  &-header {
    display: flex;
    align-items: flex-start;
    padding: 40px 45px 0;
    h3 {
      flex-grow: 1;
      padding-right: 20px;
      
    }
  }
}

.button-close {
  color: #FFFFFF;
}
</style>