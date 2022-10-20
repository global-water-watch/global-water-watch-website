<template>
  <div class="message">
    <v-icon
      v-if="icon"
      :size="iconSize"
      class="message__icon"
    >
      {{ icon }}
    </v-icon>
    <p class="message__paragraph" :class="`message--${type}`">
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
      icon: {
        type: String,
        default: '',
      },
      iconSize: {
        type: Number,
        default: 23,
      },
    },
  }
</script>

<style src="./Message.scss" lang="scss"></style>
