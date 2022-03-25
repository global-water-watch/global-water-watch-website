<template>
  <Fragment>
    <PageHeroes :sections="page.heroes" />
    <PageSections :sections="page.sections" />
  </Fragment>
</template>

<script>
  import query from './_slug.query.graphql'

  export default {
    async asyncData ({ $datocms, $preview, params }) {
      const variables = { slug: params.slug }
      const { blogpost } = await $datocms.fetchData({ query, variables, preview: !!$preview })
      return { page: blogpost, variables }
    },

    head () {
      return this.$datocms.toHead(this.page._seoMetaTags)
    },

    mounted () {
      this.$datocms.subscribeToData({
        query,
        variables: this.variables,
        onData: ({ page }) => { this.page = page },
      })
    },
  }
</script>
