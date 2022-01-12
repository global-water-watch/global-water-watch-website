<template>
  <div class="responsive-image" :class="{ 'is-cover': cover }">
    <span
      v-if="!cover"
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
      required: false,
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

<style lang="scss">
  .responsive-image {
    position: relative;
    width: 100%;
  }

  .responsive-image__aspect-ratio {
    display: block;
  }

  .responsive-image.is-cover .responsive-image__img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .responsive-image:not(.is-cover) .responsive-image__img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
  }
</style>
