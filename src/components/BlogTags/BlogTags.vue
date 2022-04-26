<template>
  <section class="layout-section layout-section--padded-small layout-section--lined blog-tags">
    <div class="layout-container">
      <h3 class="p normal">
        Categories:
      </h3>

      <ul class="blog-tags__tags">
        <li v-for="tag in tags" :key="tag.tagSlug">
          <NuxtLink :to="`/blog?tags=${tag.tagSlug}`" class="pill blog-tags__tag">
            {{ tag.tagTitle }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
  export default {
    props: {
      tags: {
        type: Array,
        required: true,
      },
    },
  }
</script>

<style src="./BlogTags.scss" lang="scss"></style>
