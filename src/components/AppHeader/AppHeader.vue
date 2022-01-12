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

<style lang="scss">
  .app-header {
    position: sticky;
    top: 0;
    left: 0;
    z-index: $layer-header;
    padding: $space-default;

    background: $color-white;
    color: $color-black;
  }

  .app-header__home-link {
    display: block;
    width: 160px;

    @media screen and (min-width: $breakpoint-medium) {
      width: 220px;
    }

    @media screen and (min-width: $breakpoint-large) {
      width: 300px;
    }
  }

  .app-header__logo {
    display: block;
    width: 100%;
    height: auto;
  }
</style>
