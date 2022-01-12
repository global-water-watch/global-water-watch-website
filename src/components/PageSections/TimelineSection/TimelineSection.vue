<template>
  <section :id="id" class="layout-section layout-section--padded layout-section--blue">
    <div class="layout-container">
      <h2>@todo: timeline section</h2>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    id: { type: String, required: true },
  },
}
</script>
