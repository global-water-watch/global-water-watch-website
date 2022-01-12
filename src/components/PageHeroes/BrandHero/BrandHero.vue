<template>
  <header :id="id" class="layout-section">
    <div class="layout-container brand-hero__inner">
      <h1 class="brand-hero__title">
        {{ title }}
      </h1>
    </div>
    <Wave color="#0AB6FF" :opacity="1" />
  </header>
</template>

<script>
  export default {
    props: {
      id: { type: String, required: true },
      title: { type: String, required: true },
    },
  }
</script>

<style lang="scss">
  .brand-hero__inner {
    padding-top: 110px;
    padding-bottom: 200px;
  }

  .brand-hero__title {
    font-weight: $font-weight-bold;
    font-size: 75px;
  }
</style>
