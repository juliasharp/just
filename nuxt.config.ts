// https://nuxt.com/docs/api/configuration/nuxt-config
import svgLoader from 'vite-svg-loader';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  pages: true,
  css: [
		'@/assets/scss/main.scss',
    '@/assets/css/tailwind.css'
	],
  vite: {
    plugins: [
      svgLoader({
        defaultImport: 'url'
      })
    ]
  },
  imports: {
    dirs: ['store', 'utils', 'animations']
  },
  runtimeConfig: {
    gravityForms: {
      apiUrl: process.env.GRAVITY_FORMS_API_URL, // e.g. http://just.local/wp-json/gf/v2
      user: process.env.GF_USER,
      password: process.env.GF_PASSWORD,
    },
    public: {
      wordpressBase: process.env.WORDPRESS_BASE,
      wordpressUrl: process.env.NUXT_PUBLIC_WORDPRESS_URL,
      residentialUri: process.env.NUXT_PUBLIC_RESIDENTIAL_URI || '/residential',
      residentialPageId:
        process.env.NUXT_PUBLIC_RESIDENTIAL_PAGE_ID || '',
    },
  },
  modules: ["vue3-carousel-nuxt", "@nuxt/image", '@nuxtjs/tailwindcss'],
})