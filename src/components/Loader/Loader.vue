<template>
  <div v-show="loading" class="loader">
    <div class="loader__ring" />
    <p class="p loader__message">
      {{ message }}
    </p>
  </div>
</template>

<script>
  export default {
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
      message: {
        type: String,
        default: '',
      },
    },
  }
</script>

<style src="./Loader.scss" lang="scss"></style>
