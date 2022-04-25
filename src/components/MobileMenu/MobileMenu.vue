<template>
  <div class="mobile-menu">
    <div class="layout-container">
      <NuxtLink to="/" :aria-label="`${title} - Back to home`" class="app-header__home-link">
        <img
          class="app-header__logo"
          src="~assets/images/global-water-watch-logo.svg"
          :alt="`${title} | ${subtitle}`"
        >
      </NuxtLink>
      <button
        class="app-header__button"
        :class="`app-header__button--${menuIsOpen ? 'open' : 'closed'}`"
        @click="toggleMenu"
        @touchmove="prevent"
      >
        <span class="sr-only">
          toggle menu
        </span>
      </button>
    </div>
    <transition name="slide" mode="out-in">
      <nav v-if="menuIsOpen" class="mobile-menu__wrapper">
        <ul v-if="links.length" class="mobile-menu__list">
          <li>
            <NuxtLink
              class="mobile-menu__link bold"
              to="/map"
            >
              Map
            </NuxtLink>
          </li>
          <li v-for="link in links" :key="link.id">
            <NuxtLink class="mobile-menu__link bold" :to="{ name: 'slug', params: { slug: link.slug }}" :aria-label="link.title">
              {{ link.title }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </transition>
  </div>
</template>

<script>
  export default {
    props: {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      links: { type: Array, default: () => [] },
    },
    data () {
      return {
        menuIsOpen: false,
      }
    },
    watch: {
      $route () {
        this.menuIsOpen = false
      },
    },
    methods: {
      prevent (e) {
        e.preventDefault()
      },
      toggleMenu () {
        this.menuIsOpen = !this.menuIsOpen
      },
    },
  }
</script>

<style src="./MobileMenu.scss" lang="scss"></style>
