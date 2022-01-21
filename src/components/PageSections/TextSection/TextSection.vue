<template>
  <section :id="id" class="layout-section layout-section--padded layout-section--lined text-section">
    <StructuredText
      class="layout-container layout-container--medium"
      :text="text"
      :links="text.links"
    />
  </section>
</template>

<script>
  export default {
    props: {
      id: {
        type: String,
        required: true,
      },
      text: {
        type: Object,
        required: true,
      },
    },
  }
</script>
