<template>
  <div class="layout-section layout-section--padded layout-section--lined related-section">
    <div class="layout-container">
      <h2 class="h2" :class="`related-section__title--${titleAlignment}`">
        {{ title }}
      </h2>
      <ul v-if="items.length" class="related-section__grid">
        <li v-for="item in items" :key="item.id">
          <CardItem
            :author="item.heroes[0].author"
            :created-at="item.createdAt"
            :image="item.heroes[0].image"
            :slug="item.slug"
            :model="item._modelApiKey"
            :text="item.heroes[0].text"
            :title="item.title"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      items: {
        type: Array,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      titleAlignment: {
        type: String,
        default: 'left',
      },
    },
  }
</script>

<style src="./RelatedSection.scss" lang="scss"></style>
