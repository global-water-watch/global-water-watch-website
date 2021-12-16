<template>
  <header role="banner" class="app-header">
    <nav>
      <NuxtLink to="/">
        {{ title }}
        {{ subtitle }}
      </NuxtLink>
    </nav>
  </header>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
  },
}
</script>

<style>
.app-header {
  background: black;
  color: white;
}
</style>
