<template>
  <section class="detail-hero">
    <div class="layout-section">
      <div class="layout-container">
        <h1 class="h1">
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
    },
  }
</script>

<style src="./DetailHero.scss" lang="scss"></style>
