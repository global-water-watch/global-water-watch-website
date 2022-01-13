<template>
  <div class="responsive-image" :class="{ 'is-cover': cover, 'is-contain': contain }">
    <span
      v-if="!cover && !contain"
      :style="`padding-top: ${height / width * 100}%`"
      class="responsive-image__aspect-ratio"
    />

    <img
      v-if="image.format === 'svg'"
      :src="image.url"
      class="responsive-image__img"
      :alt="altText"
    >

    <img
      v-else
      :src="image.url"
      :alt="altText"
      :title="image.title"
      :width="width"
      :height="height"
      :srcset="image.responsiveImage.srcSet"
      :sizes="image.responsiveImage.sizes"
      class="responsive-image__img"
      loading="lazy"
    >
  </div>
</template>

<script>
  export default {
    props: {
      image: {
        type: Object,
        required: true,
      },
      cover: {
        type: Boolean,
        default: false,
      },
      contain: {
        type: Boolean,
        default: false,
      },
    },

    computed: {
      altText () {
        // image must never have a missing alt text as then assistive tech will read its full url
        return this.image.alt || ''
      },
      width () {
        return this.image.format === 'svg' ? this.image.width : this.image.responsiveImage.width
      },
      height () {
        return this.image.format === 'svg' ? this.image.height : this.image.responsiveImage.height
      },
    },
  }
</script>

<style src="./ResponsiveImage.scss" lang="scss"></style>
