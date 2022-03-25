<template>
  <NuxtLink :to="slugRoute" class="card-item">
    <ResponsiveImage :image="image" :contain="true" />
    <h2 class="h3 card-item__title">
      {{ title }}
    </h2>
    <p class="card-item__text">
      {{ text }}
    </p>
    <address class="card-item__author">
      <ResponsiveImage class="card-item__author-image" :image="author.image" />
      <div>
        <span class="p small bold">
          {{ author.name }}
        </span>
        <time class="p small" :datetime="createdAt">{{ parsedDate }}</time>
      </div>
    </address>
  </NuxtLink>
</template>

<script>
  export default {
    props: {
      author: {
        type: Object,
        required: true,
      },
      createdAt: {
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
      model: {
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
    },
    computed: {
      slugRoute () {
        switch (this.model) {
        case 'blogpost':
          return { name: 'blog-slug', params: { slug: this.slug } }
        case 'paper':
          return { name: 'articles-slug', params: { slug: this.slug } }
        default:
          /* eslint-disable no-console */
          console.warn(`Cannot create route for '${this.model}'.`)
          return false
        }
      },
      parsedDate () {
        const date = new Date(this.createdAt)
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return date.toLocaleDateString('en-EN', options)
      },
    },
  }
</script>

<style src="./CardItem.scss"  lang="scss"></style>
