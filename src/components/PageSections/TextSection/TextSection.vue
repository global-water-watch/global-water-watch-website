<template>
  <section :id="id" class="layout-section layout-section--padded layout-section--lined text-section">
    <div class="layout-container layout-container--medium">
      <StructuredText
        class="text-section__text"
        :text="text"
        :links="text.links"
      />
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
      text: {
        type: Object,
        required: true,
      },
    },
  }
</script>
