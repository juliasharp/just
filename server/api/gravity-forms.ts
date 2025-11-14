export default defineEventHandler(async (event) => {
  const { id } = getQuery(event) as { id: string }

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing id',
    })
  }

  const base =
    process.env.GRAVITY_FORMS_PROXY_URL ||
    'http://just.local/gf-oauth-proxy=1'

  const url = new URL(base)
  url.searchParams.set('id', '/wp-json/gf/v2/forms/' + id)

  //console.log('[gravity-forms] Fetching:', url.toString())

  const res = await fetch(url.toString())

  if (!res.ok) {
    const errorText = await res.text()
    console.error('[gravity-forms] Non-OK response:', res.status, errorText)
    throw createError({
      statusCode: res.status,
      statusMessage: errorText || 'Request failed',
    })
  }

  // 🔍 Read raw text first so we can see if it's empty or malformed
  const raw = await res.text()
  //console.log('[gravity-forms] Raw response:', raw.slice(0, 300)) // log first 300 chars only

  if (!raw) {
    console.error('[gravity-forms] Empty response body from GF API.')
    throw createError({
      statusCode: 502,
      statusMessage: 'Gravity Forms API returned empty response',
    })
  }

  try {
    const json = JSON.parse(raw)
    //console.log('[gravity-forms] Parsed JSON OK')
    return json
  } catch (err) {
    console.error('[gravity-forms] JSON parse error:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Invalid JSON from Gravity Forms',
    })
  }
})
