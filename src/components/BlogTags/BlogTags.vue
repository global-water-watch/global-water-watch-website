<template>
  <div class="blog-tags">
    <ul class="blog-tags__tags">
      <li v-for="tag in tags" :key="tag.tagSlug">
        <NuxtLink :to="`/blog/tag/${tag.tagSlug}/`" class="blog-tags__tag">
          {{ tag.tagTitle }}
        </NuxtLink>
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
    },
  }
</script>

<style src="./BlogTags.scss" lang="scss"></style>
