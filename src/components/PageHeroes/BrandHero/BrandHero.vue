<template>
  <header :id="id" class="layout-section brand-hero">
    <ResponsiveImage
      :image="backgroundImage"
      :cover="true"
      class="brand-hero__background"
    />

    <div class="layout-container brand-hero__inner">
      <h1 class="brand-hero__title">
        <span class="brand-hero__decoration">{{ title }}</span>
      </h1>

      <p class="h3 brand-hero__subtitle">
        <span class="brand-hero__decoration">
          {{ subtitle }}
        </span>
      </p>
    </div>

    <Wave color="#0AB6FF" :opacity="1" />
  </header>
</template>

<script>
  export default {
    props: {
      id: { type: String, required: true },
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      backgroundImage: { type: Object, required: true },
    },
  }
</script>

<style src="./BrandHero.scss" lang="scss"></style>
