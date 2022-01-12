<template>
  <DatocmsStructuredText :data="text" />
</template>

<script>
  export default {
    props: {
      text: { type: Object, required: true },
    },
  }
</script>
