<template>
  <div class="layout-container blog-filter">
    <h3 class="p normal">
      Filter:
    </h3>

    <ul class="layout-container blog-filter__list">
      <li
        v-for="({ tagSlug, tagTitle }) in tags"
        :key="tagSlug"
        class="blog-filter__item"
      >
        <a
          :href="`/blog?tags=${tagSlug}`"
          class="pill"
          :class="{ 'pill--active': activeTags.includes(tagSlug) }"
          @click.prevent="$emit('filter', $event)"
        >
          {{ tagTitle }}
        </a>
      </li>
      <li v-if="activeTags.length" class="blog-filter__item">
        <a
          href="/blog"
          class="blog-filter__clear small"
          @click.prevent="$emit('clear')"
        >
          Remove filters
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      tags: {
        type: Array,
        required: true,
      },
      activeTags: {
        type: Array,
        required: true,
      },
    },

  }
</script>

<style src="./BlogFilter.scss" lang="scss"></style>
