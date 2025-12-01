<script setup lang="ts">
import IconClose from '/src/icon-close.svg?component';
import { useGravityForms } from '~/composables/useGravityForms'

// ---- DEBUG (safe, SSR-friendly, no Cloudflare collisions) ----
const isClient = typeof window !== 'undefined'
const isDev = (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) || false

type FieldType = 'text' | 'email' | 'tel' | 'textarea' | 'url'
type FieldDef = {
  key: string    
  label: string
  gfKey: string  
  type?: FieldType
  required?: boolean
  autocomplete?: string
  placeholder?: string
}

const props = defineProps({
  showForm: { type: Boolean, default: false },
  gfFormId: { type: Number, required: true },  // Gravity Forms DB id
  // if you want to pass fields in directly, you still can; otherwise we fetch below
  passedFields: { type: Array as () => FieldDef[] | undefined, default: undefined },
  title: { type: String, default: "Let's Collaborate" },
  theme: { type: String, default: 'dark' },
  bgColor: { type: String, default: '#390F7D' },
  redirectUrl: { type: String, default: '' }
})

const emit = defineEmits<{ (e:'update:showForm', v:boolean):void; (e:'submitted'):void }>()

const isShown = computed({
  get: () => props.showForm,
  set: v => emit('update:showForm', v)
})
function closeForm() { isShown.value = false }


// --- Get dynamic fields from WPGraphQL (or use passedFields) ---
const { fields: gqlFields, pending: fieldsPending, error: fieldsError } =
  useGfFormFields(props.gfFormId)

const fields = computed<FieldDef[]>(() => {
  const pf: any = props.passedFields
  const fromProps = (pf && (isRef(pf) ? pf.value : pf)) || undefined
  return fromProps ?? gqlFields.value ?? []
})
// --- Gravity submit composable ---
const {
  formPending,
  formError,
  formData,
  success,
  errorMsg,
  submitting,
  handleSubmit,
  confirmationType,
  confirmationMessage,
} = useGravityForms({
  formId: props.gfFormId,
  onSuccess: () => {
    // If a redirect URL is provided, go there after a successful submission
    if (props.redirectUrl && typeof window !== 'undefined') {
      window.location.href = props.redirectUrl
    }
  }
})

// --- Local UI state keyed by our dynamic field.key ---
const values  = reactive<Record<string, string>>({})
const focused = reactive<Record<string, boolean>>({})
const fieldErrors = ref<Record<string, string>>({})  // GF errors keyed by parent id ('1','3','5',...)

const valuesView = computed(() => ({ ...values }))

// Initialize values/focused when fields arrive (or change)
watch(
  fields,
  (arr) => {
    (arr || []).forEach(f => {
      if (!(f.key in values))  values[f.key]  = ''
      if (!(f.key in focused)) focused[f.key] = false
    })
  },
  { immediate: true, flush: 'sync' }
)

const disabled = computed(() => {
  if (submitting.value) return true
  const reqs = fields.value.filter(f => !!f.required)
  return reqs.some(f => !(values[f.key] && String(values[f.key]).trim().length))
})

watchEffect(() => {
  const reqs = fields.value.filter(f => !!f.required).map(f => f.key)
  const missing = reqs.filter(k => !(values[k] && String(values[k]).trim().length))
})

function onFocus(k: string) {
  if (!(k in focused)) focused[k] = false // guard if focus fires early
  focused[k] = true
}

function onBlur(k: string) {
  const v = values[k]
  focused[k] = !!(v && String(v).trim())
}

function isActive(k: string) {
  const v = values[k]
  return focused[k] || !!(v && String(v).trim())
}

// --- Submit with robust GF error mapping (works with your Nuxt API shape) ---
const attemptedSubmit = ref(false)

function syncValuesIntoFormData() {
  fields.value.forEach(f => {
    formData.value[f.gfKey] = values[f.key] ?? ''
  })
}

const submitWithErrors = async () => {
  attemptedSubmit.value = true
  fieldErrors.value = {}

  syncValuesIntoFormData()

  try {
    await handleSubmit()
    Object.keys(values).forEach(k => (values[k] = ''))
    attemptedSubmit.value = false
    emit('submitted')
  } catch (e: any) {
    const messages =
      e?.data?.messages ??
      e?.response?._data?.messages ??
      ((): any => { try {
        const parsed = JSON.parse(errorMsg.value || '{}')
        return parsed?.validation_messages
      } catch { return null } })()

    if (messages && typeof messages === 'object') {
      fieldErrors.value = messages
    }
  }
}

// --- Per-field GF error via gfKey → parent id
function errorFor(f: FieldDef) {
  const pid = (f.gfKey.split('_')[1] || '').split('.')[0] || ''
  return fieldErrors.value[pid] || ''
}

watch(fieldErrors, (fe) => {
  if (!attemptedSubmit.value) return
  const has = fe && Object.keys(fe).length
}, { deep: true })


watch(values, (v) => {
  const reqs = fields.value.filter(f => !!f.required)
  const missing = reqs.filter(f => !(values[f.key] && String(values[f.key]).trim()))
                      .map(f => f.key)
}, { deep: true })

watch(isShown, (shown) => {
  if (typeof window === 'undefined') return
  const body = document.body

  if (shown) {
    const scrollBar = window.innerWidth - document.documentElement.clientWidth
    body.style.paddingRight = scrollBar + 'px'
    body.classList.add('no-scroll')
  } else {
    body.style.paddingRight = ''
    body.classList.remove('no-scroll')
  }
})

// expose in window for quick inspection from DevTools
if (isClient && isDev) {
  (window as any).__CONTACT_FORM_DEBUG__ = {
    fields, values, submitting, errorMsg, fieldErrors
  }
}
</script>

<template>
  <div v-if="fieldsError">Error loading fields: {{ fieldsError.message }}</div>

  <form
    v-else
    class="contact-form relative"
    :class="{ 'is-shown': isShown, [theme]: true }"
    :style="{ backgroundColor: bgColor }"
    @submit.prevent="submitWithErrors"
    novalidate
  >
    <div class="contact-form__inner">
      <div class="contact-form__header">
        <h3>{{ title }}</h3>
        <button type="button" class="button button-close" @click="closeForm">
          <div class="button-close"><IconClose /></div>
        </button>
      </div>

      <div class="contact-form__body">
        <div
          v-for="f in fields"
          :key="f.key"
          class="form-input__field"
        >
          <component
            :key="f.key"
            :is="f.type === 'textarea' ? 'textarea' : 'input'"
            :value="values[f.key] ?? ''"
            @input="(e:any) => {
              values[f.key] = e?.target?.value ?? ''
            }"
            class="input-field"
            :type="f.type && f.type !== 'textarea' ? f.type : undefined"
            :placeholder="f.placeholder"
            :autocomplete="f.autocomplete"
            @focus="onFocus(f.key)"
            @blur="onBlur(f.key)"
            :rows="f.type === 'textarea' ? 4 : undefined"
            :aria-invalid="!!errorFor(f)"
            :aria-describedby="errorFor(f) ? `${f.key}-err` : undefined"
            :class="[{ 'is-invalid': !!errorFor(f) }, theme]"
          />
          <label class="form-label" :class="{ focused: isActive(f.key) }">
            {{ f.label }}<span v-if="f.required" class="required">*</span>
          </label>
          <p v-if="errorFor(f)" :id="`${f.key}-err`" class="field-error">
            {{ errorFor(f) }}
          </p>
        </div>
      </div>

      <div class="contact-form__footer">
        <div class="contact-form-button-container">
          <button type="submit" class="contact-form-button" :disabled="disabled">
            <div class="button">
              {{ submitting ? 'Sending…' : 'Send' }}
              <svg viewBox="0 0 24 24" height="24" width="24">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </div>
          </button>
        </div>

        <p v-if="formPending || fieldsPending" style="margin-top:12px; opacity:.8;">Submitting…</p>
        <p v-if="errorMsg && Object.keys(fieldErrors).length === 0" style="margin-top:12px;">
          {{ errorMsg }}
        </p>
        <p v-if="success" style="margin-top:12px; color:#bfffbf;">
          <!-- If GF confirmation is a "text" message, show it -->
          <span
            v-if="confirmationType === 'message' && confirmationMessage"
            v-html="confirmationMessage"
          />
          <!-- Otherwise, show fallback -->
          <span v-else>
            Thanks! We’ll be in touch shortly.
          </span>
        </p>
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
  width: 100%;

  transform: translate3d(110%,0,0);
  transition: transform .7s cubic-bezier(.44, .24, .16, 1);
  will-change: transform;
  &.is-shown {
    transform: translate3d(0, 0, 0);
  }
  @media (min-width: 768px) {
    width: calc(340px + 17vw);
  }
  // @media (min-width: 1024px) {
  //   width: calc(340px + 17vw);
  // }
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
    @media (max-width: 767px) {
      padding-right: calc(13.62px + 3.4398vw);
      padding-left: calc(13.62px + 3.4398vw);
    }
  }
  &__header {
    padding: 40px 40px 0;
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
        font-size: 35px;
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
    .button svg {
      fill: rgb(240, 240, 238);
    }
  }
  &:hover {
    background: rgb(240, 240, 238);
    color: #390F7D;
    .button svg {
      fill: #390F7D;
    }
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

.form-input__field input,
.form-input__field textarea {
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