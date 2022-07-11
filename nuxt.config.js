import path from 'path'
import themes from './src/assets/theme/themes'

/**
 * @type {import('@nuxt/types').NuxtOptions}
 */
export default {
  publicRuntimeConfig: {
    datocmsReadonlyToken: process.env.DATOCMS_READONLY_TOKEN,
    gtmCode: process.env.GTM_CODE,
    mapBoxToken: process.env.MAPBOX_TOKEN,
    mapBoxStyle: process.env.MAPBOX_STYLE,
  },

  srcDir: 'src/',

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Serve smaller modern bundles to modern browsers
  modern: process.env.NODE_ENV === 'production' ? 'client' : false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s',
    title: 'Global Water Watch',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // Google
      { rel: 'dns-prefetch', href: '//www.googletagmanager.com' },
      { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/scss/index.scss',
  ],

  styleResources: {
    scss: [
      '@/assets/scss/variables.scss',
    ],
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // { src: '~plugins/preview-mode.client.js' },
    { src: '~plugins/datocms.js' },
    { src: '~plugins/google-analytics.client.js' },
    { src: '~plugins/vue-dato-video.js' },
    { src: '~plugins/vue-fragment.js' },
    { src: '~plugins/vue2mapbox-gl.client.js' },
    { src: '~plugins/create-repository.js' },
    { src: '~plugins/experimental-features.js', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://composition-api.nuxtjs.org/
    '@nuxtjs/composition-api/module',
    // https://go.nuxtjs.dev/eslint
    ['@nuxtjs/eslint-module', {
      fix: true,
    }],
    // https://go.nuxtjs.dev/vuetify
    ['@nuxtjs/vuetify', {
      customVariables: ['~/assets/scss/variables.scss'],
      treeShake: true,
      theme: {
        dark: true,
        themes,
      },
      breakpoint: {
        // https://vuetifyjs.com/en/features/breakpoints/#thresholds
        // Note: these values should match $grid-breakpoints in variables.scss.
        thresholds: {
          xs: 600,
          sm: 800,
          md: 1100,
          lg: 1900,
        },
      },
      defaultAssets: {
        font: false,
        icons: 'mdi',
      },
    }],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@voorhoede/nuxt-preview-mode-module',
    '@nuxtjs/axios',
  ],

  axios: {
    baseURL: process.env.API_BASE_URL,
  },

  // Preview mode: https://github.com/voorhoede/nuxt-preview-mode-module
  previewMode: {
    previewSecret: process.env.PREVIEW_SECRET,
  },

  // Alias: https://nuxtjs.org/docs/configuration-glossary/configuration-alias
  alias: {
    '@': path.resolve(__dirname, 'src/'),
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend (config) {
      config.module.rules.push({
        test: /\.graphql?$/,
        loader: 'webpack-graphql-loader',
      })
    },
    transpile: [/echarts/, /zrender/],
    html: {
      // disable unneeded CSS & JS minification in HTML for faster builds
      // @see https://www.voorhoede.nl/en/blog/10x-faster-nuxt-builds-on-netlify/#optimise-html-minification
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: false,
        minifyJS: false,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
      },
    },
  },

  generate: {
    fallback: true,
  },
}
