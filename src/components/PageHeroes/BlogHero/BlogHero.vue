<template>
  <section class="blog-hero">
    <div class="layout-section">
      <div class="layout-container">
        <h1 class="h1">
          {{ title }}
        </h1>

        <p v-if="text" class="blog-hero__summary">
          {{ text }}
        </p>

        <Person
          v-if="author"
          :image="author.image"
          :name="author.name"
          :role="author.role"
          :organisation="author.organisation"
          class="blog-hero__author"
        />
      </div>
    </div>

    <div v-if="image" class="layout-section blog-hero__image-wrapper">
      <span
        class="blog-hero__image-background"
        :style="{ 'background-image': `url(${image.responsiveImage.src}&blur=70)` }"
      />
      <ResponsiveImage :image="image" class="layout-container blog-hero__image" />
    </div>
  </section>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        default: undefined,
      },
      image: {
        type: Object,
        default: undefined,
      },
      author: {
        type: Object,
        default: undefined,
      },
    },
  }
</script>

<style src="./BlogHero.scss" lang="scss"></style>
