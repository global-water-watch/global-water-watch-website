<template>
  <ClientOnly v-if="$nuxt.isPreview">
    <VSystemBar dark height="50">
      <VIcon aria-hidden color="green">
        mdi-access-point
      </VIcon>
      <span>Preview mode: {{ statusMessage }}</span>
      <VSpacer />
      <VBtn type="button" @click="exitPreview">
        Exit preview
      </VBtn>
    </VSystemBar>
  </ClientOnly>
</template>

<script>
export default {
  computed: {
    status () {
      return this.$datocms.state.status
    },
    statusMessage () {
      return this.$datocms.state.error
        ? 'An error occurred.'
        : this.$datocms.state.statusMessage
    },
  },
  methods: {
    exitPreview () {
      this.$previewMode.exit()
    },
  },
}
</script>
