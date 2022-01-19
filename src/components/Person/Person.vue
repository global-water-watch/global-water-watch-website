<template>
  <article class="person">
    <ResponsiveImage :image="image" class="person__image" />
    <div>
      <h3 class="p bold">
        {{ name }}
      </h3>
      <span>{{ role }},</span><br>
      <span>{{ organisation }}</span>
    </div>
  </article>
</template>

<script>
  export default {
    props: {
      image: {
        type: Object,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
      organisation: {
        type: String,
        required: true,
      },
    },
  }
</script>

<style src="./Person.scss" lang="scss"></style>
