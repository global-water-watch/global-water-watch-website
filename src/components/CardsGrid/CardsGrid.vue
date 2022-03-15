<template>
  <section class="layout-section layout-section--padded layout-section--lined cards-grid">
    <div class="layout-container">
      <div v-if="items.length" class="cards-grid__grid">
        <CardItem
          v-for="item in items"
          :key="item.id"
          :author="item.heroes[0].author"
          :created-at="item.createdAt"
          :image="item.heroes[0].image"
          :slug="item.slug"
          :text="item.heroes[0].text"
          :title="item.title"
        />
      </div>
    </div>
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
