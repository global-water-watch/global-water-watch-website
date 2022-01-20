<template>
  <DatocmsStructuredText
    class="structured-text"
    v-bind="$attrs"
    :data="text"
  />
</template>

<script>
  export default {
    inheritAttrs: false,
    props: {
      text: { type: Object, required: true },
    },
  }
</script>

<style src="./StructuredText.scss" lang="scss"></style>
