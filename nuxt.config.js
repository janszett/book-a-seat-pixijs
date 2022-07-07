export default {
  /*
  // To run on local ip instead of localhost
  server: {
    host: '0'
  },
  */
  ssr: false,
  env: {
    apiEndpointSeats: '/api/seats'
  },
  target: 'static',
  head: {
    title: 'book-a-seat-pixijs',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  css: [],
  serverMiddleware: [
    { path: '/api', handler: '~/api/index.js' }
  ],
  components: true,
  buildModules: [
    '@nuxt/postcss8',
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/tailwindcss'
  ],
  modules: [],
  build: {
    postcss: {
      plugins: {
        'postcss-url': false,
        'postcss-nested': {},
        'postcss-responsive-type': {},
        'postcss-hexrgba': {},
        'postcss-custom-media': {
          importFrom: [
            './globals/postcss.js'
          ]
        }
      },
      preset: {
        autoprefixer: {
          grid: true
        }
      }
    }
  }
};
