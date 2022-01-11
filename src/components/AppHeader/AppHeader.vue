<template>
  <header role="banner" class="app-header">
    <div class="layout-container">
      <nav>
        <NuxtLink to="/">
          {{ title }}
          {{ subtitle }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
  },
}
</script>

<style lang="scss">
  .app-header {
    position: sticky;
    top: 0;
    left: 0;
    z-index: $layer-header;
    padding: 20px;

    background: $color-white;
    color: black;
  }
</style>
