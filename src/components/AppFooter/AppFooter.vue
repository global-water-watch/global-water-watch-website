<template>
  <footer role="contentinfo" class="layout-section layout-section--force-lined app-footer">
    <div class="layout-container app-footer__inner">
      <Wave class="app-footer__wave" />
      <h2>{{ title }}</h2>

      <p>{{ subtitle }}</p>

      <div class="app-footer__bottom app-footer__flex-center">
        <p class="small">
          Copyright {{ year }} Deltares
        </p>

        <nav class="small">
          <ul class="app-footer__legals app-footer__flex-center">
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
      </div>
    </div>
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

<style lang="scss">
  .app-footer {
    text-align: center;
  }

  .app-footer__inner {
    position: relative;
    padding-top: $space-xlarge;
    padding-bottom: $space-default;
  }

  .app-footer__wave {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  .app-footer__flex-center {
    display: flex;

    > * + * {
      margin-left: $space-medium;
    }
  }

  .app-footer__bottom {
    justify-content: center;
  }

  .app-footer .app-footer__legals {
    padding: 0;
    list-style: none;
  }
</style>
