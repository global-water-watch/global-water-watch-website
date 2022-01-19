<template>
  <BlogHero
    :title="page.title"
    :summary="page.summary"
    :image="page.image"
    :author="page.author"
  />
</template>

<script>
  import query from './_slug.query.graphql'
  import BlogHero from '@/components/PageHeroes/BlogHero/BlogHero'

  export default {
    components: {
      BlogHero,
    },

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
