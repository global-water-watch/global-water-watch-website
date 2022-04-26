<template>
  <Fragment>
    <PageHeroes :sections="page.heroes" />

    <section class="layout-section layout-section--padded layout-section--lined">
      <BlogFilter
        :tags="tags"
        :active-tags="activeTags"
        @filter="filter"
        @clear="clearFilters"
      />
      <CardsGrid :items="filtered" />
    </section>

    <PageSections :sections="page.sections" />
  </Fragment>
</template>

<script>
  import query from './index.query.graphql'

  export default {
    async asyncData ({ $datocms, $preview }) {
      const { page, allBlogposts, allBlogpostTags } = await $datocms.fetchData({ query, preview: !!$preview })
      return { page, items: allBlogposts, tags: allBlogpostTags }
    },

    data: () => ({
      activeTags: [],
    }),

    head () {
      return this.$datocms.toHead(this.page._seoMetaTags)
    },

    computed: {
      filtered () {
        return this.activeTags.length
          ? this.items.filter(({ tags }) => tags.some(({ tagSlug }) => this.activeTags.includes(tagSlug)))
          : this.items
      },
    },

    watch: {
      '$route' () {
        this.setActiveTags()
      },
    },

    mounted () {
      this.setActiveTags()

      this.$datocms.subscribeToData({
        query,
        onData: ({ page }) => { this.page = page },
      })
    },

    methods: {
      setActiveTags () {
        this.activeTags = this.$route.query.tags ? this.$route.query.tags.split(',') : []
      },

      filter ({ target }) {
        const { searchParams } = new URL(target.href)
        const tag = new URLSearchParams(searchParams).get('tags')
        const index = this.activeTags.indexOf(tag)

        if (index > -1) {
          this.activeTags.splice(index, 1)
        } else {
          this.activeTags.push(tag)
        }

        this.$router.replace({ path: 'blog', query: { tags: this.activeTags.join(',') } })
      },

      clearFilters () {
        this.activeTags = []
        this.$router.replace({ path: 'blog', query: { tags: undefined } })
      },
    },
  }
</script>
