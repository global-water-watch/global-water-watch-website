<template>
  <section :id="id" class="layout-section layout-section--lined layout-section--padded">
    <div class="layout-container layout-container--medium">
      <h2>@todo: newsletter section</h2>
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
