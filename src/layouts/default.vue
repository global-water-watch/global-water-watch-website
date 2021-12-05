<template>
  <VApp>
    <PreviewBar v-if="$nuxt.isPreview" />
    <VMain>
      <VContainer>
        <Nuxt />
      </VContainer>
    </VMain>
  </VApp>
</template>

<script>
export default {
  data () {
    return {}
  },
}
</script>
