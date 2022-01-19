<template>
  <header role="banner" class="app-header">
    <div class="layout-container">
      <nav>
        <NuxtLink to="/" :aria-label="`${title} - Back to home`" class="app-header__home-link">
          <img
            class="app-header__logo"
            src="~assets/images/global-water-watch-logo.svg"
            :alt="`${title} | ${subtitle}`"
          >
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

<style src="./AppHeader.scss" lang="scss"></style>
