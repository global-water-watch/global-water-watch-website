<template>
  <div>
    <h1>{{ page.title }}</h1>
    <DatocmsImage :data="page.image.responsiveImage" />
  </div>
</template>

<script>
import query from './index.query.graphql'

export default {
  async asyncData ({ $datocms, $preview }) {
    const { page } = await $datocms.fetchData({ query, preview: !!$preview })
    return { page }
  },
  head () {
    return this.$datocms.toHead(this.page.seo)
  },
  mounted () {
    if (this.$nuxt.isPreview) {
      this.$datocms.subscribeToData({
        query,
        onData: ({ page }) => { this.page = page },
      })
    }
  },
}
</script>
