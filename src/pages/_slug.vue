<template>
  <div>
    <h1>{{ page.title }}</h1>
    <DatocmsImage :data="page.seo.image.responsiveImage" />
  </div>
</template>

<script>
  import query from './_slug.query.graphql'

  export default {
    async asyncData ({ $datocms, $preview, params }) {
      const variables = { slug: params.slug }
      const { page } = await $datocms.fetchData({ query, variables, preview: !!$preview })
      return { page, variables }
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
