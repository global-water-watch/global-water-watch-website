import deltaresThemes from '@deltares/vuetify-theme'

/**
 * @type {import('@nuxt/types').NuxtOptions}
 */
export default {
  publicRuntimeConfig: {
    datocmsReadonlyToken: process.env.DATOCMS_READONLY_TOKEN,
    previewModeSecret: process.env.PREVIEW_SECRET,
  },

  srcDir: 'src/',

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Serve smaller modern bundles to modern browsers
  modern: 'client',

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
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~plugins/preview-mode.client.js' },
    { src: '~plugins/datocms.js' },
    { src: '~plugins/vue-fragment.js' },
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
      customVariables: ['~/assets/variables.scss'],
      theme: {
        themes: deltaresThemes,
      },
    }],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend (config) {
      config.module.rules.push({
        test: /\.graphql?$/,
        loader: 'webpack-graphql-loader',
      })
    },
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
}
