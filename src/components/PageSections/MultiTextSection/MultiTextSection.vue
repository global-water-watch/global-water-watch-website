<template>
  <section :id="id">
    <h2>{{ title }}</h2>
    <div
      v-for="item in items"
      :key="item.id"
    >
      <h3>{{ item.title }}</h3>
      <StructuredText :text="item.text" />
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
}
</script>
