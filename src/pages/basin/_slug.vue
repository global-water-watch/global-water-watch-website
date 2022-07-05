<template>
  <Fragment>
    <client-only>
      <!-- BasinATLAS_v10_lev03 -->
      <div>Basin page</div>
    </client-only>
  </Fragment>
</template>

<script>
  export default {
    fetch () {
      const { slug } = this.$route.params
      if (!slug) { return }
      console.log(slug)
    },

    fetchOnServer: false,
  }
</script>
