<template>
  <section
    :id="id"
    class="layout-section layout-section--padded timeline-section"
    :class="themeClass"
  >
    <div class="layout-container">
      <h2 class="h2 timeline-section__title">
        {{ title }}
      </h2>

      <ul class="timeline-section__items">
        <li v-for="item in items" :key="item.id" class="timeline-section__item">
          <h3 class="p bold">
            {{ item.title }}
          </h3>

          <StructuredText
            :text="item.text"
            :links="item.text.links"
          />
        </li>
      </ul>
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
        required: true,
      },
      items: {
        type: Array,
        required: true,
      },
      theme: {
        type: Object,
        default: () => {},
      },
    },

    computed: {
      themeClass () {
        return (this.theme && this.theme.slug === 'highlight')
          ? 'layout-section--blue'
          : 'layout-section--lined'
      },
    },
  }
</script>

<style src="./TimelineSection.scss" lang="scss"></style>
