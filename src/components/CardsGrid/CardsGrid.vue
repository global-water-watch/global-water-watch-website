<template>
  <ul v-if="items.length" class="layout-container cards-grid">
    <li v-for="item in items" :key="item.id">
      <CardItem
        :author="item.heroes[0].author"
        :first-published-at="item.firstPublishedAt"
        :image="item.heroes[0].image"
        :slug="item.slug"
        :text="item.heroes[0].text"
        :title="item.title"
        :tags="item.tags"
      />
    </li>
  </ul>
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
