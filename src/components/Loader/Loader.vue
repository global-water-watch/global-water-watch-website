<template>
  <div v-show="loading" class="loader">
    <div class="loader__ring" />
  </div>
</template>

<script>
  export default {
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
    },
  }
</script>

<style src="./Loader.scss" lang="scss"></style>
