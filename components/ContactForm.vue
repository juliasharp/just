<script setup lang="ts">
import IconClose from '/src/icon-close.svg?component';

defineProps({
	showForm: {
		type: Boolean,
		default: true
	}
});

const name = ref('');
const subject = ref('');
const email = ref('');
const message = ref('');

const disabled = computed(() => {
  return !name.value || !subject.value || !email.value || !message.value;
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
  isShown.value = false;
}

function onFocus(){
  console.log("focus");
}

watch([name, subject, email, message], ([newName, newSubject, newEmail, newMessage]) => {
  console.log('Name:', newName);
  console.log('Subject:', newSubject);
  console.log('Email:', newEmail);
  console.log('Message:', newMessage);
});
</script>

<template>
  <form action="https://formspree.io/f/xjvnonvd" method="POST" class="contact-form">
    <div class="contact-form__inner">
      <div class="contact-form__header">
        <h3>Let's Collaborate</h3>
        <button class="button button-close" @click="closeForm">
          <div class="button-close">
            <IconClose></IconClose>
          </div>
        </button>
      </div>
      <div class="contact-form__body">
        <div class="form-input__field" @focus="onFocus">
          <input type="text" label="Name" name="name" spellcheck="false" class="form-input" v-model="name">
          <label value="" for="name" class="form-label">Name</label>
        </div>
        <div class="form-input__field">
          <input type="text" label="Subject" name="subject" spellcheck="false" class="form-input" v-model="subject">
          <label value="" for="name" class="form-label">Subject</label>
        </div>
        <div class="form-input__field">
          <input type="text" label="Email" name="email" spellcheck="false" class="form-input" v-model="email">
          <label value="" for="name" class="form-label">Email</label>
        </div>
        <div class="form-input__field">
          <input type="text" label="Message" name="name" spellcheck="false" class="form-input" v-model="message">
          <label value="" for="name" class="form-label">Message</label>
        </div>
      </div>
      <div class="contact-form-footer">
        <div class="contact-form-button-container">
          <button class="contact-form-button" :disabled="disabled">
            <div class="css-yz760h epg31qi0">Send
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
                ></path>
              </svg>
            </div>
          </button>
      </div>
      </div>
    </div>
  </form>
</template>

<style lang="scss">
.contact-form {
  position: fixed;
  z-index: 99;
  display: flex;
  flex-direction: column;
  top: 0;
  right: 0;
  bottom: 0;
  background: #390F7D;
  color: white;
  transition: transform 700ms cubic-bezier(0.44, 0.24, 0.16, 1);
  // transform: translate3d(110%, 0, 0);
  @media (min-width: 1024px) {
    width: calc(340px + 17vw);
  }
  &__inner {
    position: static;
  }
  &__body {
    padding: 0 40px;
    padding-top: calc(37.13px + 0.893655vw);
  }
  &__header {
    display: flex;
    align-items: flex-start;
    padding: 40px 45px 0;
    h3 {
      flex-grow: 1;
      font-size: 45px;
      padding-right: 20px;
      font-family: 'Inter Bold';
    }
  }
  &-button {
    appearance: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    outline: none;
    display: inline-block;
    vertical-align: middle;
    padding: 0px 1.25em 3px 1.5em;
    cursor: pointer;
    border-radius: 0px;
    text-align: center;
    box-shadow: none;
    font-family: Plain, -apple-system, serif;
    letter-spacing: -0.01em;
    text-transform: none;
    line-height: 1em;
    font-weight: 600;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizelegibility;
    transition: background 0.3s ease-in-out 0s, color 0.3s ease-in-out 0s, border 0.3s ease-in-out 0s, box-shadow 0.3s ease-in-out 0s, transform 0.3s ease-in-out 0s, opacity 0.3s ease-in-out 0s;
    height: 72px;
    min-width: calc(144px);
    width: 100%;
    background: transparent;
    border: 2px solid rgb(240, 240, 238);
    color: rgb(240, 240, 238);
  }
}

.button-close {
  color: #FFFFFF;
}

.form-input__field {
  position: relative;
  display: inline-block;
  width: 100%;
  line-height: 1.6em;
  letter-spacing: -0.01em;
  text-transform: none;
  font-weight: normal;
  color: rgb(0, 0, 0);
  margin-bottom: calc(13.57px + 0.446828vw)
}

input {
  padding-left: 0px;
  padding-right: 0px;
  border-top: 0px rgb(240, 240, 238);
  border-left: 0px rgb(240, 240, 238);
  border-right: 0px rgb(240, 240, 238);
  width: 100%;
  height: 50px;
  background: transparent;
  color: rgb(240, 240, 238);
  border-bottom-color: rgb(240, 240, 238);
}

label {
  position: absolute;
  padding: 0px 0px 8px;
  left: 0px;
  margin-left: 0px;
  height: auto;
  bottom: 0px;
  top: auto;
  font-weight: 600;
  color: rgb(240, 240, 238);
  opacity: 0.5;
  &.focused {
    opacity: 1;
    transform: translate3d(0px, -18px, 0px) scale(0.75);
    color: rgb(240, 240, 238);
  }
}

</style>