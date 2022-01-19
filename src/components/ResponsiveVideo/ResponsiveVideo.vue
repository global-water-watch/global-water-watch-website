<template>
  <div class="responsive-video">
    <vue-dato-video
      :loop="true"
      :autoplay="true"
      :mute="true"
      :video="video"
    />
  </div>
</template>

<script>
  export default {
    props: {
      video: {
        type: Object,
        required: true,
      },
    },
  }
</script>
