// server/api/gravity-submit.post.ts
import { defineEventHandler, readBody, getQuery, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const q = getQuery(event) as Record<string, any>
  const raw = (await readBody(event).catch(() => ({}))) as any

  // Accept form_id from body (form_id/formId) or query (?id=/form_id=)
  const formId = raw?.form_id ?? raw?.formId ?? q?.id ?? q?.form_id
  if (!formId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing form_id' })
  }

  // Build flat input_* map from either input_values, values, or top-level
  const flat: Record<string, any> = {}

  const addKV = (obj: any) => {
    if (!obj || typeof obj !== 'object') return
    for (const [k, v] of Object.entries(obj)) {
      if (
        v === undefined ||
        v === null ||
        (typeof v === 'string' && v.trim() === '')
      ) {
        continue
      }
      // If key already looks like input_1.3, keep it as-is; otherwise prefix
      const key = k.startsWith('input_') ? k : `input_${k}`
      flat[key] = v
    }
  }

  // Prefer explicit maps, then raw body
  addKV(raw?.input_values)
  addKV(raw?.values)
  addKV(raw)

  // 🔴 IMPORTANT: normalize advanced Name field (id=1)
  const first = flat['input_1.3']
  const last  = flat['input_1.6']

  if (first || last) {
    // ensure the hidden sub-inputs exist
    flat['input_1.2'] ??= ''
    flat['input_1.4'] ??= ''
    flat['input_1.8'] ??= ''

    // build full name into parent input_1 (what GF validates)
    const full = [first, last]
      .filter(Boolean)
      .map(String)
      .map(s => s.trim())
      .join(' ')
      .trim()

    if (full) {
      flat['input_1'] = full
    }
  }

  // Base GF REST v2 URL, e.g. http://just.local/wp-json/gf/v2
  const apiBase =
    (process.env.GRAVITY_FORMS_API_URL ||
     (config as any).gravityForms?.apiUrl ||
     '').replace(/\/+$/, '')

  if (!apiBase) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing GRAVITY_FORMS_API_URL',
    })
  }

  // Basic Auth (username:password or GF REST key:secret)
  const user =
    process.env.GF_CONSUMER_KEY ||
    (config.gravityForms?.user as string)

  const password =
    process.env.GF_CONSUMER_SECRET ||
    (config.gravityForms?.password as string)

  if (!user || !password) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing GF_CONSUMER_KEY or GF_CONSUMER_SECRET',
    })
  }

  
  const url = `${apiBase}/forms/${formId}/submissions`
  const authHeader =
    'Basic ' + Buffer.from(`${user}:${password}`).toString('base64')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      ...flat,
      source_page: 1,
      target_page: 1,
    }),
  })

  const text = await response.text()
  // console.log('⬅️ Gravity Forms response:', response.status, text)

  if (!response.ok) {
    let details: any
    try {
      details = JSON.parse(text)
    } catch {}

    if (details?.validation_messages) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Validation failed',
        data: { messages: details.validation_messages },
      })
    }

    throw createError({
      statusCode: response.status,
      statusMessage: details?.message || 'Submission Failed',
    })
  }

  return JSON.parse(text)
})
