<template>
  <footer role="contentinfo" class="app-footer layout-section layout-section--force-lined">
    <v-container>
      <v-row no-gutters>
        <v-col>
          <Wave class="app-footer__wave" />
          <h2 class="h2">
            {{ title }}
          </h2>
          <p>{{ subtitle }}</p>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <div class="app-footer__bottom app-footer__flex-center">
            <p class="small">
              Copyright {{ year }} Deltares
            </p>
            <nav class="small">
              <ul class="app-footer__legals app-footer__flex-center">
                <li v-for="link in links" :key="link.id">
                  <AppLink
                    v-if="link._modelApiKey === 'external_link'"
                    :href="link.url"
                    rel="noopener"
                    target="_blank"
                  >
                    {{ link.title }}
                  </AppLink>
                  <AppLink
                    v-if="link._modelApiKey === 'internal_link'"
                    :to="pageUrl(link.page)"
                  >
                    {{ link.title }}
                  </AppLink>
                </li>
              </ul>
            </nav>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </footer>
</template>

<script>
  import AppLink from '@/components/AppLink/AppLink'

  export default {
    components: { AppLink },
    props: {
      title: {
        type: String,
        required: true,
      },
      subtitle: {
        type: String,
        required: true,
      },
      links: {
        type: Array,
        default () { return [] },
      },
    },
    computed: {
      year () {
        return (new Date()).getFullYear()
      },
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

<style src="./AppFooter.scss" lang="scss"></style>
