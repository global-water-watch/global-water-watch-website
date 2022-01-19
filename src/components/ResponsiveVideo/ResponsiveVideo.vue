<template>
  <div class="responsive-video">
    <vue-dato-video
      :autoplay="autoplay"
      :loop="loop"
      :mute="mute"
      :video="video"
    />
  </div>
</template>

<script>
  export default {
    props: {
      autoplay: {
        type: Boolean,
        required: true,
      },
      loop: {
        type: Boolean,
        required: true,
      },
      mute: {
        type: Boolean,
        required: true,
      },
      video: {
        type: Object,
        required: true,
      },
    },
  }
</script>
