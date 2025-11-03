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
    public: {
      wordpressUrl: process.env.NUXT_PUBLIC_WORDPRESS_URL,        // existing
      residentialUri: process.env.NUXT_PUBLIC_RESIDENTIAL_URI || '/residential',
      residentialPageId: process.env.NUXT_PUBLIC_RESIDENTIAL_PAGE_ID || '' // e.g. "234" on local
    }
  },
  modules: ["vue3-carousel-nuxt", "@nuxt/image", '@nuxtjs/tailwindcss'],
})