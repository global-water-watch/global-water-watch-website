<template>
  <section
    :id="id"
    class="layout-section layout-section--lined layout-section--padded"
  >
    <div class="layout-container">
      <h2>@todo: people section</h2>
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
