<template>
  <NuxtLink :to="slugRoute" class="card-item">
    <ResponsiveImage :image="image" :contain="true" />
    <h4 class="h3 card-item__title">
      {{ title }}
    </h4>
    <p class="card-item__text">
      {{ text }}
    </p>
    <div class="card-item__author">
      <ResponsiveImage class="card-item__author-image" :image="author.image" />
      <div>
        <h3 class="p small bold">
          {{ author.name }}
        </h3>
        <time class="p small" :datetime="createdAt">{{ parsedDate }}</time>
      </div>
    </div>
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
        return { name: `${this.$route.name}-slug`, params: { slug: this.slug } }
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
