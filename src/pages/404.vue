<template>
  <section class="error-404 layout-section layout-section--padded layout-section--lined">
    <div class="layout-container">
      <h1 class="h1">
        404 - Not Found
      </h1>
      <NuxtLink to="/" class="v-btn v-btn--has-bg theme--light elevation-0 v-size--large primary">
        Home page
      </NuxtLink>
    </div>
  </section>
</template>

<script>
  export default {
    layout: 'error',
  }
</script>

<style lang="scss">
  .error-404 .layout-container {
    text-align: center;
  }

  .error-404 .v-btn {
    margin-top: $space-default;
  }
</style>
