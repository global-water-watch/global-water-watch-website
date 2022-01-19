<template>
  <PageHeroes :sections="page.heroes" />
</template>

<script>
  import query from './_slug.query.graphql'

  export default {
    async asyncData ({ $datocms, $preview, params }) {
      const variables = { slug: params.slug }
      const { blog } = await $datocms.fetchData({ query, variables, preview: !!$preview })
      return { page: blog, variables }
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
