<template>
  <div class="message">
    <p class="p message__paragraph" :class="`message--${type}`">
      {{ message }}
    </p>
  </div>
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        default: '',
      },
      message: {
        type: String,
        default: '',
      },
    },
  }
</script>

<style src="./Message.scss" lang="scss"></style>
