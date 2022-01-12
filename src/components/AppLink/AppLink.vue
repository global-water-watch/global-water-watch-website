<template>
  <component
    :is="to ? 'router-link' : 'a'"
    :to="to ? to : null"
    class="app-link"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script>
  export default {
    props: {
      to: {
        type: [String, Object],
        validator (value) {
          if (!value || typeof value === 'string') {
            return true
          }

          return (
            value.name && (value.params)
              ? Object.keys(value.params).length > 0
              : true
          )
        },
        default: '',
      },
    },
  }
</script>

<style src="./AppLink.scss" lang="scss"></style>
