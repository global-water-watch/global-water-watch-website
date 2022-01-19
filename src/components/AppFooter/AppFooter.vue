<template>
  <footer role="contentinfo" class="layout-section layout-section--force-lined app-footer">
    <div class="layout-container app-footer__inner">
      <h2 class="h2">
        {{ title }}
      </h2>
      <p>{{ subtitle }}</p>

      <div class="app-footer__bottom app-footer__flex-center">
        <p class="small">
          Copyright {{ year }} Deltares
        </p>

        <nav class="small">
          <ul class="app-footer__legals app-footer__flex-center">
            <li v-for="link in links" :key="link.id">
              <AppLink :link="link">
                {{ link.title }}
              </AppLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <Wave class="app-footer__wave" />
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
  }
</script>

<style src="./AppFooter.scss" lang="scss"></style>
