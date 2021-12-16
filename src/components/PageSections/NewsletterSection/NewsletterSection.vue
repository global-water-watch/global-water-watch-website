<template>
  <section :id="id">
    <h2>@todo: newsletter section</h2>
  </section>
</template>

<script>
export default {
  props: {
    id: { type: String, required: true },
  },
}
</script>
