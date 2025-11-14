// ~/composables/useGravityForms.ts
type AnyObj = Record<string, any>

interface UseGravityFormsOptions {
  formId: number
  fetchForm?: boolean
  getEndpoint?: string
  submitEndpoint?: string
  initialData?: AnyObj
  extraValues?: AnyObj
  onSuccess?: (res: any) => void
  onError?: (message: string, raw: any) => void
  debug?: boolean
}

export function useGravityForms(opts: UseGravityFormsOptions) {
  const {
    formId,
    fetchForm = true,
    getEndpoint = '/api/gravity-forms',
    submitEndpoint = '/api/gravity-submit',
    initialData = {},
    extraValues = {},
    onSuccess,
    onError,
    debug = process.dev,
  } = opts

  // -------- Optional schema fetch --------
  const form = ref<any>(null)
  const formPending = ref(false)
  const formError = ref<any>(null)

  if (fetchForm) {
    const { data, pending, error } = useFetch(getEndpoint, {
      query: { id: formId },
      server: false,
    })
    watchEffect(() => {
      form.value = data.value
      formPending.value = pending.value
      formError.value = error.value
    })

    // NEW: derive default confirmation from form schema (if available)
    watchEffect(() => {
      const f = form.value as any
      if (!f || !f.confirmations) return

      const confirmations = f.confirmations as Record<string, any>
      const list = Object.values(confirmations)
      if (!list.length) return

      // Prefer default confirmation, otherwise first
      const active =
        list.find((c: any) => c.isDefault) ?? list[0]

      if (active) {
        confirmationType.value    = active.type || null   // "message", "page", "redirect"
        confirmationMessage.value = active.message || null
      }
    })
  }

  // -------- Instance state --------
  const formData    = ref<AnyObj>({ ...initialData })
  const submitting  = ref(false)
  const success     = ref(false)
  const errorMsg    = ref('')
  const fieldErrors = ref<Record<string, string>>({})
  const confirmationType    = ref<string | null>(null)
  const confirmationMessage = ref<string | null>(null)

  // Normalize to GF keys and strip empties
  const buildFields = () => {
    const out: AnyObj = {}
    for (const [k, v0] of Object.entries(formData.value)) {
      const v = typeof v0 === 'string' ? v0.trim() : v0
      if (v === undefined || v === null || v === '') continue
      if (/^\d+(\.\d+)?$/.test(k)) {
        out[`input_${k}`] = v
      } else {
        out[k] = v // assume already input_X or input_X.Y
      }
    }
    Object.assign(out, extraValues)
    return out
  }

  // Clear a parent error if any of its inputs change
  watch(formData, (now, prev) => {
    for (const key of Object.keys(now)) {
      if (!prev || now[key] !== prev[key]) {
        const m = key.match(/^input_(\d+)(?:\.\d+)?$/)
        if (m) delete fieldErrors.value[m[1]]
      }
    }
  }, { deep: true })

  // Build multiple safe variants
  function buildFieldsVariants(src: Record<string, any>) {
    const flatDots: Record<string, any> = {}
    const numericMap: Record<string, any> = {} // "1.3":"Julia", "3":"email"

    for (const [k, v] of Object.entries(src)) {
      if (v === undefined || v === null || v === '') continue
      const dotKey = k.startsWith('input_') ? k : `input_${k}` // "input_1.3"
      flatDots[dotKey] = v
      numericMap[dotKey.replace(/^input_/, '')] = v // "1.3"
    }

    return { flatDots, numericMap }
  }

  function parseServerError(raw: any): { messages?: Record<string,string>, message?: string } {
    if (!raw) return {}
    if (raw?.data?.messages) return { messages: raw.data.messages }
    if (raw?.response?._data?.messages) return { messages: raw.response._data.messages }
    if (raw?.validation_messages) return { messages: raw.validation_messages }
    if (raw?.message?.validation_messages) return { messages: raw.message.validation_messages }
    if (typeof raw === 'string') {
      try {
        const j = JSON.parse(raw)
        if (j?.validation_messages) return { messages: j.validation_messages }
        if (j?.message?.validation_messages) return { messages: j.message.validation_messages }
        if (j?.message) return { message: j.message }
      } catch {}
    }
    if (raw?.message) return { message: raw.message }
    return {}
  }

  // -------- Submit via proxy --------
  const handleSubmit = async () => {
    submitting.value = true
    success.value = false
    errorMsg.value = ''
    fieldErrors.value = {}

    // Start from normalized fields then make variants
    const base = buildFields()
    const { flatDots, numericMap } = buildFieldsVariants(base)

    // IMPORTANT:
    // - Keep root-level input_* keys (flatDots)
    // - Provide numeric maps under values/input_values/field_values
    const body: Record<string, any> = {
      formId,
      form_id: formId,
      ...flatDots,                    // input_1.3, input_3, ...
      values: numericMap,             // { "1.3":"...", "3":"..." }
      input_values: numericMap,
      field_values: numericMap,
      source_page: 1,
      target_page: 0,
    }

    try {
      const result = await $fetch<any>(submitEndpoint, { method: 'POST', body })

      if (result && result.is_valid === false) {
        const messages = result.validation_messages || {}
        fieldErrors.value = messages
        errorMsg.value = ''
        throw createError({ statusCode: 422, data: { messages } })
      }

      // 🔹 Try to read confirmation info from the submission response
      const resType =
        (result as any)?.confirmation_type ??
        confirmationType.value

      const resMessage =
        (result as any)?.confirmation_message ??
        confirmationMessage.value

      if (resType)    confirmationType.value    = resType
      if (resMessage) confirmationMessage.value = resMessage

      success.value = true
      formData.value = {}
      onSuccess?.(result)
      return result
    } catch (err: any) {
      const parsed = parseServerError(err) || {}
      if (parsed.messages) {
        fieldErrors.value = parsed.messages
        errorMsg.value = ''
        throw createError({ statusCode: 422, data: { messages: parsed.messages } })
      }
      errorMsg.value = parsed.message || 'There was an error submitting the form.'
      onError?.(errorMsg.value, err)
      throw err
    } finally {
      submitting.value = false
    }
  }

  return {
    // schema
    form, formPending, formError,

    // instance
    formData, submitting, success, errorMsg, fieldErrors,

    // NEW: confirmation info
    confirmationType,
    confirmationMessage,

    // actions
    handleSubmit, buildFields,
  }
}
