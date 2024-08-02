// https://nuxt.com/docs/api/configuration/nuxt-config
import svgLoader from 'vite-svg-loader';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  pages: true,
  css: [
		'@/assets/scss/main.scss',
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
      wordpressUrl: process.env.WORDPRESS_URL || 'http://just.local/graphql'
    }
  },
  modules: ["vue3-carousel-nuxt", "@nuxt/image"],
})