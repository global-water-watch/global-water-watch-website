<template>
  <section :id="id" class="layout-section layout-section--padded layout-section--lined multi-text">
    <div class="layout-container">
      <h2 v-if="title" class="h2">
        {{ title }}
      </h2>
      <div class="multi-text__items" :class="[columnClass]">
        <div
          v-for="item in items"
          :key="item.id"
          class="multi-text__item"
        >
          <h3 v-if="item.title" class="h3">
            {{ item.title }}
          </h3>
          <StructuredText :text="item.text" class="multi-text__text" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    props: {
      id: { type: String, required: true },
      title: { type: String, required: true },
      items: { type: Array, required: true },
    },

    computed: {
      columnClass () {
        const { length } = this.items
        const baseClasses = 'multi-text__columns multi-text__columns--'
        if (length > 1) {
          return length > 2 ? baseClasses + 3 : baseClasses + 2
        }
        return 'layout-container layout-container--medium'
      },
    },
  }
</script>

<style lang="scss">
  .multi-text {
    text-align: center;
  }

  .multi-text__columns {
    &:not(:first-child) {
      margin-top: $space-xlarge;
    }

    @media screen and (min-width: $breakpoint-large) {
      display: grid;
      gap: $space-large;
    }
  }

  .multi-text__columns--2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .multi-text__columns--3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .multi-text__text:not(:first-child) {
    margin-top: $space-default;
  }
</style>
