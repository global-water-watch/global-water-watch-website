<template>
  <Fragment>
    <PageHeroes :sections="page.heroes" />
    <CardsGrid :items="items" />
    <PageSections :sections="page.sections" />
  </Fragment>
</template>

<script>
  import query from './_slug.query.graphql'

  export default {
    async asyncData ({ $datocms, $preview, params }) {
      const { allBlogpostTags } = await $datocms.fetchData({ query, preview: !!$preview })
      const [tag] = allBlogpostTags.filter(tag => tag.tagSlug === params.slug)

      const variables = { tag: tag.id }
      const { page, allBlogposts } = await $datocms.fetchData({ query, variables, preview: !!$preview })

      return { page, items: allBlogposts, variables }
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
