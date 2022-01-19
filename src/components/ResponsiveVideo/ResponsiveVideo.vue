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
