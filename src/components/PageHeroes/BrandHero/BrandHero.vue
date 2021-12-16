<template>
  <header :id="id">
    <h1>{{ title }}</h1>
  </header>
</template>

<script>
export default {
  props: {
    id: { type: String, required: true },
    title: { type: String, required: true },
  },
}
</script>
