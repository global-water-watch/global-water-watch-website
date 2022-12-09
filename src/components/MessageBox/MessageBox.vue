<template>
  <v-skeleton-loader
    v-if="isLoading"
    class="message__skeleton-loader"
    type="text"
  />
  <div v-else class="message">
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
      isLoading: {
        type: Boolean,
        default: false,
      },
    },
  }
</script>

<style src="./MessageBox.scss" lang="scss"></style>
