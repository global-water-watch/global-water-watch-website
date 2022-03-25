<template>
  <section :id="id" class="layout-section layout-section--padded layout-section--lined quote-section">
    <figure class="layout-container">
      <blockquote class="quote-section__quote">
        <StructuredText
          :text="text"
        />
      </blockquote>
      <figcaption class="layout-container quote-section__quotee p small">
        {{ person.name }}, {{ person.organisation }}
      </figcaption>
    </figure>
  </section>
</template>

<script>
  export default {
    props: {
      id: {
        type: String,
        required: true,
      },
      person: {
        type: Object,
        required: true,
      },
      text: {
        type: Object,
        required: true,
      },
    },
  }
</script>

<style src="./QuoteSection.scss" lang="scss"></style>
