<template>
  <Fragment>
    <span
      v-if="open"
      class="social-share__hitarea"
      @click="() => open = false"
    />
    <focus-trap
      v-model="open"
      :escape-deactivates="true"
    >
      <aside
        class="social-share"
        :class="{
          open: open,
          enhanced: enhanced
        }"
      >
        <button
          type="button"
          :aria-expanded="open"
          :aria-label="open ? 'Close options' : 'Show options'"
          class="social-share__toggle"
          @click="share"
        >
          Share page
          <v-icon
            :size="iconSize"
            color="black"
          >
            mdi-share-variant
          </v-icon>
        </button>

        <div ref="collapsible" :aria-hidden="!open" class="social-share__collapsible">
          <ul class="social-share__options">
            <li
              v-for="option in shareOptions"
              :key="option.icon"
            >
              <a
                :href="`${option.url}${encodeURI(shareUrl)}`"
                target="_blank"
                rel="noopnener noreferrer"
                class="social-share__option"
                :aria-label="`Deel op ${option.name}`"
              >
                <v-icon
                  :size="iconSize"
                  :color="iconColor"
                >
                  {{ `mdi-${option.icon}` }}
                </v-icon>
              </a>
            </li>

            <li>
              <button type="button" aria-label="Copy to clipboard" @click="copyToClipBoard">
                <v-icon
                  v-if="copied"
                  :size="iconSize"
                  color="success"
                >
                  mdi-check
                </v-icon>
                <v-icon
                  v-else
                  :size="iconSize"
                  :color="iconColor"
                >
                  mdi-content-copy
                </v-icon>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </focus-trap>
  </Fragment>
</template>

<script>
  import { FocusTrap } from 'focus-trap-vue'

  const shareOptions = [
    { name: 'Facebook', url: 'https://www.facebook.com/sharer.php?u=', icon: 'facebook' },
    { name: 'Twitter', url: 'https://twitter.com/intent/tweet?&url=', icon: 'twitter' },
    { name: 'Linkedin', url: 'https://www.linkedin.com/sharing/share-offsite/?url=', icon: 'linkedin' },
  ]

  export default {
    components: { FocusTrap },

    data () {
      return {
        open: false,
        animation: undefined,
        enhanced: false,
        iconSize: 23,
        shareOptions,
        copied: false,
        shareUrl: undefined,
        iconColor: '#000A13',
      }
    },

    watch: {
      open () {
        if (this.enhanced) {
          this.animate()
        }
      },
    },

    mounted () {
      this.shareUrl = window.location.href

      if (this.$refs.collapsible) {
        this.enhanced = this.$refs.collapsible.animate !== undefined
      }
    },

    methods: {
      share () {
        if (navigator.share) {
          navigator.share({
            url: this.shareUrl,
          })
        } else {
          this.open = !this.open
        }
      },

      async copyToClipBoard () {
        this.copied = true

        try {
          await navigator.clipboard.writeText(this.shareUrl)
        } catch (err) {
          throw new Error('Error: Copy to clipboard')
        } finally {
          setTimeout(() => {
            this.copied = false
          }, 2000)
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
          duration: 200,
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
