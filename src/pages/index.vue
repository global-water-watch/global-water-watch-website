<template>
  <Fragment>
    <PageHeroes :sections="page.heroes" />
    <PageSections :sections="page.sections" />
  </Fragment>
</template>

<script>
import query from './index.query.graphql'

export default {
  async asyncData ({ $datocms, $preview }) {
    const { page } = await $datocms.fetchData({ query, preview: !!$preview })
    return { page }
  },
  head () {
    return this.$datocms.toHead(this.page._seoMetaTags)
  },
  mounted () {
    this.$datocms.subscribeToData({
      query,
      onData: ({ page }) => { this.page = page },
    })
  },
}
</script>
