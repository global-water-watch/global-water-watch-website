<template>
  <section :id="id" class="layout-section layout-section--padded layout-section--lined logo-section">
    <div class="layout-container layout-container--medium">
      <h2 class="h2">
        {{ title }}
      </h2>

      <StructuredText :text="text" class="logo-section__text" />

      <ul
        class="logo-section__logos"
        :class="{ 'logo-section__logos--white': logoOnWhiteBackground}"
      >
        <li
          v-for="logo in images"
          :key="logo.id"
          class="logo-section__logo"
          :class="{'logo-section__logo--fill': images.length === 1 }"
        >
          <ResponsiveImage
            :image="logo"
            :contain="true"
            class="logo-section__logo-image"
          />
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
  export default {
    props: {
      id: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      text: {
        type: Object,
        default: undefined,
      },
      images: {
        type: Array,
        required: true,
      },
      logoOnWhiteBackground: {
        type: Boolean,
        default: undefined,
      },
    },
  }
</script>

<style src="./LogoSection.scss" lang="scss"></style>
