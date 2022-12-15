<template>
  <article>
    <div class="card-item__top">
      <NuxtLink :to="slugRoute" class="card-item__link card-item__top-area" tabindex="-1">
        <ResponsiveImage :image="image" :contain="true" />
      </NuxtLink>

      <ul v-if="tags" class="card-item__tags card-item__top-area">
        <li v-for="({ tagSlug, tagTitle }) in tags" :key="tagSlug">
          <NuxtLink :to="`/blog?tags=${tagSlug}`" class="pill pill--blue">
            {{ tagTitle }}
          </NuxtLink>
        </li>
      </ul>
    </div>

    <NuxtLink :to="slugRoute" class="card-item__link">
      <h2 class="h3 card-item__title">
        {{ title }}
      </h2>
    </NuxtLink>

    <p class="card-item__text">
      {{ text }}
    </p>

    <address class="card-item__author">
      <ResponsiveImage class="card-item__author-image" :image="author.image" />

      <div>
        <span class="p small bold">
          {{ author.name }}
        </span>
        <time class="p small" :datetime="firstPublishedAt">{{ parsedDate }}</time>
      </div>
    </address>
    <article />
  </article>
</template>

<script>
  export default {
    props: {
      author: {
        type: Object,
        required: true,
      },
      firstPublishedAt: {
        type: String,
        required: true,
      },
      image: {
        type: Object,
        required: true,
      },
      slug: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      tags: {
        type: Array,
        default: undefined,
      },
    },
    computed: {
      slugRoute () {
        return `/blog/${this.slug}`
      },
      parsedDate () {
        const date = new Date(this.firstPublishedAt)
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return date.toLocaleDateString('en-EN', options)
      },
    },
  }
</script>

<style src="./CardItem.scss"  lang="scss"></style>
