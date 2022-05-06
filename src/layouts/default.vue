<template>
  <VApp>
    <PreviewModeBar />
    <AppHeader
      v-if="appData"
      v-bind="appData.header"
    />
    <MobileMenu
      v-if="appData"
      v-bind="appData.header"
    />
    <VMain>
      <Nuxt />
      <SocialShare />
    </VMain>
    <AppFooter
      v-if="!onMap && appData"
      v-bind="appData.footer"
    />
    <GridLines v-if="!onMap" />
    <client-only>
      <cookie-law
        v-if="showCookieBanner && appData"
        button-class="v-btn v-btn--has-bg theme--light elevation-0 v-size--large primary"
        :button-text="appData.cookies.acceptLabel"
        :button-link="appData.cookies.infoUrl"
        :button-link-text="appData.cookies.infoLabel"
        :button-link-new-tab="true"
        theme="dark-lime"
      />
    </client-only>
  </VApp>
</template>

<script>
  import query from './app.query.graphql'
  import config from '@/static/config/webconfig.json'
  import { transformAppData } from '@/lib/content-helpers'
  const CookieLaw = () => (process.client ? import('vue-cookie-law') : null)

  export default {
    components: { CookieLaw },
    data () {
      return {
        showCookieBanner: false,
        appData: undefined,
      }
    },
    async fetch () {
      const { app } = await this.$datocms.fetchData({ query, preview: !!this.$preview })
      this.appData = transformAppData(app)
    },
    computed: {
      onMap () {
        return this.$route.name === 'map'
      },
    },
    mounted () {
      this.showCookieBanner = config?.COOKIE_BANNER || false
      this.$datocms.subscribeToData({
        query,
        onData: ({ app }) => {
          this.appData = transformAppData(app)
        },
      })
    },
  }
</script>
