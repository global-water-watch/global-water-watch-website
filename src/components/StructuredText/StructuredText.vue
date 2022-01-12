<template>
  <DatocmsStructuredText :data="text" class="structured-text" />
</template>

<script>
  export default {
    props: {
      text: { type: Object, required: true },
    },
  }
</script>

<style src="./StructuredText.scss" lang="scss"></style>
