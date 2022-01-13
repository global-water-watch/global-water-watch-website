<template>
  <aside class="social-share" :class="{ open: open, enhanced: enhanced }">
    <button
      type="button"
      :aria-expanded="open"
      :aria-label="open ? 'Close options' : 'Show options'"
      class="social-share__toggle"
      @click="toggle"
    >
      Pagina delen
    </button>

    <div ref="collapsible" :aria-hidden="!open" class="social-share__collapsible">
      <ul class="social-share__options">
        <li>
          <a ahref="https://twitter.com">Twitter</a>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>
  export default {
    props: {},

    data () {
      return {
        open: false,
        animation: undefined,
        enhanced: false,
      }
    },

    mounted () {
      if (this.$refs.collapsible) {
        this.enhanced = this.$refs.collapsible.animate !== undefined
      }
    },

    methods: {
      toggle () {
        this.open = !this.open
        if (this.enhanced) {
          this.animate()
        }
      },

      animate () {
        if (this.animation) {
          this.animation.onfinish = () => {}
        }

        const el = this.$refs.collapsible

        this.animation = el.animate({
          height: [`${el.clientHeight}px`, this.open ? `${el.scrollHeight}px` : '0px'],
        }, {
          duration: 400,
          easing: 'cubic-bezier(.17,.67,.35,.98)',
          fill: 'both',
        })

        if (this.open) {
          this.animation.onfinish = () => {
            el.animate({ height: 'auto' }, { duration: 0.1, fill: 'both' })
          }
        }
      },
    },
  }
</script>

<style src="./SocialShare.scss" lang="scss"></style>
