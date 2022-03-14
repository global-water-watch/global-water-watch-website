<template>
  <section class="error-page layout-section layout-section--padded layout-section--lined">
    <div class="layout-container">
      <h1 v-if="error.statusCode === 404" class="h1">
        404 - Not Found
      </h1>
      <h1 v-else class="h1">
        An error occurred
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
    props: {
      error: {
        type: Object,
        default: null,
      },
    },
  }
</script>

<style lang="scss">
  .error-page .layout-container {
    text-align: center;
  }

  .error-page .v-btn {
    margin-top: $space-default;
  }
</style>
