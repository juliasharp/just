// plugins/ga.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  if (process.env.NODE_ENV !== 'production') return

  // Replace with your GA4 ID
  const GA_MEASUREMENT_ID = 'G-PT3XYCH28J'

  // Inject Google tag script
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  script.async = true
  document.head.appendChild(script)

  // Initialize GA
  window.dataLayer = window.dataLayer || []
  function gtag() { window.dataLayer.push(arguments) }
  gtag('js', new Date())
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  })

  nuxtApp.hook('page:finish', () => {
    gtag('event', 'page_view', { page_path: window.location.pathname })
  })
})
