<template>
  <div ref="container" class="wave" />
</template>

<script>
  import WebglWave from '../webgl/WebglWave'

  export default {
    props: {
      color: {
        type: String,
        default: '#ffffff',
      },
      opacity: {
        type: Number,
        default: 0.4,
      },
    },

    data: () => ({
      isPlaying: true,
    }),

    watch: {
      isPlaying (playing) {
        if (playing) {
          this.wave.play()
        } else {
          this.wave.pause()
        }
      },
    },

    mounted () {
      this.observer = new IntersectionObserver(
        this.observe, { threshold: [0] },
      )
      this.observer.observe(this.$refs.container)

      this.wave = new WebglWave({
        container: this.$refs.container,
        color: this.color,
        opacity: this.opacity,
      })
    },

    beforeDestroy () {
      if (this.wave) {
        this.wave.destroy()
      }
    },

    methods: {
      observe (entries) {
        entries.forEach(({ target, isIntersecting }) => {
          this.isPlaying = isIntersecting
        })
      },
    },
  }
</script>

<style src="./Wave.scss" lang="scss"></style>
