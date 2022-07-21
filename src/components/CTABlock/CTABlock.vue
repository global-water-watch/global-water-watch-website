<template>
  <div class="cta-block">
    <h2 class="cta-block__subtitle">
      {{ title }}
    </h2>

    <StructuredText
      :text="text.text"
      :links="text.text.links"
    />

    <AppLink
      v-if="link"
      :link="link"
      class="cta-block__button v-btn v-btn--has-bg v-size--default"
    >
      {{ link.title }}
    </AppLink>
  </div>
</template>

<script>
  export default {
    props: {
      items: {
        type: Array,
        default: () => [],
      },
    },

    computed: {
      singleBlock () {
        const [singleBlock] = this.items
        return singleBlock
      },

      text () {
        const [text] = this.singleBlock.text
        return text
      },

      title () {
        return this.text.title
      },

      link () {
        const [link] = this.singleBlock.links
        return link
      },
    },
  }
</script>

<style src="./CTABlock.scss" lang="scss"></style>
