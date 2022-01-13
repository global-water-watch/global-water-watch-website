<template>
  <VApp>
    <PreviewModeBar />
    <AppHeader v-bind="app.header" />
    <VMain>
      <Nuxt />
      <SocialShare />
    </VMain>
    <AppFooter v-bind="app.footer" />
    <GridLines />
  </VApp>
</template>

<script>
  import query from './app.query.graphql'

  /**
   * app header & footer are implemented as modular content (array) for editor experience
   * but the app object should only have a single header & footer, so transforming it
   */
  const transformAppData = appData => ({
    header: appData.header[0],
    footer: appData.footer[0],
  })

  export default {
    data () {
      return {
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
    mounted () {
      this.$datocms.subscribeToData({
        query,
        onData: ({ app }) => {
          this.app = transformAppData(app)
        },
      })
    },
  }
</script>
