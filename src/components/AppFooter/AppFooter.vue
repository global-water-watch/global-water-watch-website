<template>
  <footer role="contentinfo" class="app-footer">
    <h2>{{ title }}</h2>
    <p>{{ subtitle }}</p>
    <p>Copyright {{ year }} Deltares</p>
    <nav>
      <ul>
        <li v-for="link in links" :key="link.id">
          <!-- @todo: turn InternalLink and ExternalLink into components -->
          <a
            v-if="link._modelApiKey === 'external_link'"
            :href="link.url"
            rel="noopener"
            target="_blank"
          >
            {{ link.title }}
          </a>
          <NuxtLink
            v-if="link._modelApiKey === 'internal_link'"
            :to="pageUrl(link.page)"
          >
            {{ link.title }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </footer>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    links: { type: Array, default () { return [] } },
  },
  computed: {
    year () { return (new Date()).getFullYear() },
  },
  methods: {
    pageUrl (page) {
      switch (page._modelApiKey) {
        case 'home':
          return '/'
        case 'page':
          return `/${page.slug}`
        default:
          // eslint-disable-next-line no-console
          console.warn('unknown page._modelApiKey', page)
          return '/'
      }
    },
  },
}
</script>

<style>
.app-footer {
  background: black;
  color: white;
}
</style>
