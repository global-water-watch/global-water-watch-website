<template>
  <div class="responsive-video">
    <VueDatoVideo
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
        default: false,
      },
      loop: {
        type: Boolean,
        default: false,
      },
      mute: {
        type: Boolean,
        default: true,
      },
      video: {
        type: Object,
        required: true,
      },
    },
  }
</script>
