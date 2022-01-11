<template>
  <section :id="id" class="layout-section layout-section--padded layout-section--lined">
    <div class="layout-container layout-container--medium">
      <h2>@todo: logo section</h2>
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
