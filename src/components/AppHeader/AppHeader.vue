<template>
  <header role="banner" class="app-header">
    <div class="layout-container">
      <nav class="app-header__navigation">
        <NuxtLink to="/" :aria-label="`${title} - Back to home`" class="app-header__home-link">
          <img
            class="app-header__logo"
            src="~assets/images/global-water-watch-logo.svg"
            :alt="`${title} | ${subtitle}`"
          >
        </NuxtLink>
        <ul v-if="links.length" class="app-header__menu">
          <li v-for="link in links" :key="link.id">
            <NuxtLink class="app-header__link bold" :to="`/${link._modelApiKey}/${link.slug}`" :aria-label="link.title">
              {{ link.title }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
  export default {
    props: {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      links: { type: Array, default: () => [] },
    },
  }
</script>

<style src="./AppHeader.scss" lang="scss"></style>
