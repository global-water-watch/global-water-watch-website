<template>
  <section class="detail-hero">
    <div class="layout-section">
      <div class="layout-container">
        <v-skeleton-loader
          v-if="isLoading"
          class="detail-hero__skeleton-loader"
          type="heading"
        />
        <h1 v-else class="h1">
          {{ title }}
        </h1>
        <slot />
      </div>
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
      isLoading: {
        type: Boolean,
        default: false,
      },
    },
  }
</script>

<style src="./DetailHero.scss" lang="scss"></style>
