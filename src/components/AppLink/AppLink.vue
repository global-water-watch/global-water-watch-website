<template>
  <component
    :is="element"
    class="app-link"
    :to="to"
    :href="href"
    :rel="rel"
    :target="target"
  >
    <slot />
  </component>
</template>

<script>
  export default {
    props: {
      link: {
        type: Object,
        required: true,
        default: () => {},
      },
    },
    computed: {
      element () {
        return this.to ? 'router-link' : 'a'
      },
      href () {
        return this.isExternalLink && this.link?.url
          ? this.link?.url
          : null
      },
      isExternalLink () {
        return this.link?._modelApiKey === 'external_link'
      },
      isInternalLink () {
        return this.link?._modelApiKey === 'internal_link'
      },
      pageUrl () {
        const { _modelApiKey, slug } = this.link?.page
        switch (_modelApiKey) {
        case 'home':
          return '/'
        case 'page':
          return `/${slug}`
        default:
          // eslint-disable-next-line no-console
          console.warn('Unknown page._modelApiKey', _modelApiKey)
          return '/'
        }
      },
      rel () {
        return this.href
          ? 'noopener'
          : null
      },
      target () {
        return this.href
          ? '_blank'
          : null
      },
      to () {
        return this.isInternalLink && this.pageUrl
          ? this.pageUrl
          : null
      },
    },
  }
</script>

<style src="./AppLink.scss" lang="scss"></style>
