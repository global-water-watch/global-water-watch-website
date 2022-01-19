<template>
  <VApp :class="{ 'v-application--cookies-accepted': cookiesAccepted }">
    <PreviewModeBar />
    <AppHeader v-bind="app.header" />
    <VMain>
      <Nuxt />
      <SocialShare />
    </VMain>
    <AppFooter v-bind="app.footer" />
    <GridLines />
    <client-only>
      <cookie-law
        v-if="showCookieBanner && !cookiesAccepted"
        button-class="v-btn v-btn--has-bg theme--light elevation-0 v-size--large primary"
        :button-text="app.cookies.acceptLabel"
        :button-link="app.cookies.infoUrl"
        :button-link-text="app.cookies.infoLabel"
        :button-link-new-tab="true"
        theme="dark-lime"
        @accept="onAccept"
      />
    </client-only>
  </VApp>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import query from './app.query.graphql'
  import config from '@/static/config/webconfig.json'
  const CookieLaw = () => (process.client ? import('vue-cookie-law') : null)

  /**
   * app header & footer are implemented as modular content (array) for editor experience
   * but the app object should only have a single header & footer, so transforming it
   */
  const transformAppData = appData => ({
    header: appData.header[0],
    footer: appData.footer[0],
    cookies: {
      acceptLabel: appData.cookiesAcceptLabel,
      infoLabel: appData.cookiesInfoLabel,
      infoUrl: appData.cookiesInfoUrl,
    },
  })

  export default {
    components: { CookieLaw },
    data () {
      return {
        showCookieBanner: false,
        app: {
          header: {},
          footer: {},
        },
      }
    },
    async fetch () {
      const { app } = await this.$datocms.fetchData({ query, preview: !!this.$preview })
      this.app = transformAppData(app)
    },
    computed: {
      ...mapState(['cookiesAccepted']),
    },
    mounted () {
      this.showCookieBanner = config?.COOKIE_BANNER || false
      this.setCookiesAccepted({ cookiesAccepted: !this.showCookieBanner })

      this.$datocms.subscribeToData({
        query,
        onData: ({ app }) => {
          this.app = transformAppData(app)
        },
      })
    },
    methods: {
      ...mapActions(['setCookiesAccepted']),
      onAccept () {
        this.setCookiesAccepted({ cookiesAccepted: true })
      },
    },
  }
</script>
