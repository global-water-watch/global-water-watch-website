<template>
  <section :id="id" class="layout-section layout-section--padded layout-section--lined multi-text">
    <div class="layout-container">
      <h2 v-if="title" class="h2">
        {{ title }}
      </h2>
      <div class="multi-text__columns" :class="[columnClass]">
        <div
          v-for="item in items"
          :key="item.id"
          class="multi-text__item"
        >
          <h3 v-if="item.title" class="h3">
            {{ item.title }}
          </h3>
          <StructuredText
            class="multi-text__text"
            :text="item.text"
            :links="item.text.links"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    props: {
      id: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        default: undefined,
      },
      items: {
        type: Array,
        required: true,
      },
    },

    computed: {
      columnClass () {
        const { length } = this.items
        const baseClass = 'multi-text__columns--'
        return length > 2 ? baseClass + 3 : baseClass + 2
      },
    },
  }
</script>

<style src="./MultiTextSection.scss" lang="scss"></style>
