<script setup lang="ts">
import IconClose from '/src/icon-close.svg?component';

const props = defineProps({
	showForm: {
		type: Boolean,
		default: true
	}
});

const name = ref('');
const subject = ref('');
const email = ref('');
const message = ref('');

const focusedField = ref({
  name: false,
  subject: false,
  email: false,
  message: false
});

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

function onFocus(fieldName: string) {
  focusedField.value[fieldName] = true;
}

function onBlur(fieldName: string) {
  if (!eval(fieldName).value) {
    focusedField.value[fieldName] = false;
  }
}

watch([name, subject, email, message], ([newName, newSubject, newEmail, newMessage]) => {
  console.log('Name:', newName);
  console.log('Subject:', newSubject);
  console.log('Email:', newEmail);
  console.log('Message:', newMessage);
});



</script>

<template>
  <form :class="{'is-shown': isShown}" action="https://formspree.io/f/xblrgkle" method="POST" class="contact-form">
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
        <div class="form-input__field">
          <input
            type="text"
            label="Name"
            name="name"
            spellcheck="false"
            class="input-field"
            v-model="name"
            @focus="onFocus('name')"
            @blur="onBlur('name')"
          />
          <label :class="{ focused: focusedField.name || name }" for="name" class="form-label">Name</label>
        </div>
        <div class="form-input__field">
          <input
            type="text"
            label="Subject"
            name="subject"
            spellcheck="false"
            class="input-field"
            v-model="subject"
            @focus="onFocus('subject')"
            @blur="onBlur('subject')"
          />
          <label :class="{ focused: focusedField.subject || subject }" for="subject" class="form-label">Subject</label>
        </div>
        <div class="form-input__field">
          <input
            type="text"
            label="Email"
            name="email"
            spellcheck="false"
            class="input-field"
            v-model="email"
            @focus="onFocus('email')"
            @blur="onBlur('email')"
          />
          <label :class="{ focused: focusedField.email || email }" for="email" class="form-label">Email</label>
        </div>
        <div class="form-input__field">
          <input
            type="text"
            label="Message"
            name="message"
            spellcheck="false"
            class="input-field"
            v-model="message"
            @focus="onFocus('message')"
            @blur="onBlur('message')"
          />
          <label :class="{ focused: focusedField.message || message }" for="message" class="form-label">Message</label>
        </div>
      </div>
      <div class="contact-form__footer">
        <div class="contact-form-button-container">
          <button class="contact-form-button" :disabled="disabled">
            <div class="button">Send
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped>
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
  overflow: auto;
  width: calc(340px + 17vw);
  transition: transform 700ms cubic-bezier(0.44, 0.24, 0.16, 1);
  transform: translate3d(110%, 0, 0); // Default state when closed
  will-change: transform;
  transition-delay: 0.5s;
  &.is-shown {
    transition-delay: 0.5s;
    transition: transform 1s cubic-bezier(0.44, 0.24, 0.16, 1);
    transform: none; // When the form is shown
    will-change: transform;
  }
  @media (min-width: 1024px) {
    width: calc(340px + 17vw);
  }
  &__inner {
    position: static;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  &__body {
    padding: 0 40px;
    padding-top: calc(37.13px + 0.893655vw);
    -webkit-box-flex: 1;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  &__header {
    padding: 40px 45px 0;
    -webkit-box-flex: 0;
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    align-items: flex-start;
    @media (max-width: 767px) {
      padding-right: calc(13.62px + 3.4398vw);
      padding-left: calc(13.62px + 3.4398vw);
      padding-top: calc(21.15px + 2.457vw);
    }
    h3 {
      flex-grow: 1;
      font-size: 45px;
      padding-right: 20px;
      font-family: 'Inter Bold';
      @media (max-width: 767px) {
        font-size: 40px;
      }
    }
  }
  &__footer {
    padding: 0 40px;
    margin-top: 20px;
    padding-top: 0px;
    -webkit-box-flex: 0;
    flex-grow: 0;
    flex-shrink: 0;
    padding-bottom: 50px;
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
    font-family: 'Inter Bold';
    text-transform: none;
    line-height: 1em;
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

.contact-form-button {
  color: #FFFFFF;
  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
    background: transparent;
    color: rgb(240, 240, 238);
    border-color: rgb(240, 240, 238);
  }
  &:hover {
    background: rgb(240, 240, 238);
    color: #390F7D;
  }
}

.button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  padding: 0px;
  width: 100%;
  min-width: 48px;
  border-radius: 50%;
  transition: background 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out, box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  font-size: 16px;
}

.button-close {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 48px;
  border-radius: 50%;
  svg {
    fill: white;
    transition: transform 0.3s ease-in-out;
  }
  &:hover {
    background: rgb(240, 240, 238);
    svg {
      fill: #390F7D;
      @media (min-width: 760px) {
        transform: scale(0.666);
      }
    }
  }
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
  margin-bottom: calc(13.57px + 0.446828vw);
  @media (max-width: 760px) {
    font-size: 15px;
    margin-bottom: calc(20px + 0.446828vw);
  }
}

.form-input__field input {
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
  @media (min-width: 1024px) {
    padding-top: calc(13.43px + 0.178731vw);
  }
  @media (max-width: 760px) {
    font-size: 15px;
    height: 35px;
  }
}

.form-label {
  position: absolute;
  font-style: inherit;
  font-size: inherit;
  font-family: inherit;
  font-weight: inherit;
  line-height: inherit;
  top: 0px;
  left: 2px;
  height: 100%;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  pointer-events: none;
  margin: 0px 1em;
  color: inherit;
  transition: transform 0.3s ease-in-out, color 0.3s ease-in-out, opacity 0.3s ease-in-out;
  transform-origin: 0% 50%;
}

.form-input__field label {
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

.slide-enter-active,
.slide-leave-active {
  transition: transform 700ms cubic-bezier(0.44, 0.24, 0.16, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>