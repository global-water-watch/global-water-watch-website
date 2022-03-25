<template>
  <section class="layout-section layout-section--padded layout-section--lined cards-grid">
    <ul v-if="items.length" class="layout-container cards-grid__grid">
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
  </section>
</template>

<script>
  export default {
    props: {
      items: {
        type: Array,
        required: true,
      },
    },
  }
</script>

<style src="./CardsGrid.scss" lang="scss"></style>
