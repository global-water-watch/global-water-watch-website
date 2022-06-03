<template>
  <section class="layout-section layout-section--padded-small layout-section--lined project-share ma-3">
    <div class="layout-container">
      <v-row class="mb-3">
        <h3 class="p normal">
          {{ title }}
        </h3>
      </v-row>
      <v-row>
        <a
          v-if="downloadUrl"
          download
          :href="`${downloadUrl}?format=csv&file=1`"
          class="v-btn v-btn--has-bg v-size--default blue-grey darken-3 white--text mr-2"
        >
          Download as .csv
          <v-icon right>
            mdi-download
          </v-icon>
        </a>
        <v-btn
          color="blue-grey darken-3"
          class="mr-2"
          @click="copyToClipBoard"
        >
          Copy url
          <v-icon right>
            mdi-content-copy
          </v-icon>
        </v-btn>
        <input type="text" class="project-share__input" :value="shareUrl" readonly>
      </v-row>
    </div>
  </section>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        required: true,
      },

      downloadUrl: {
        type: String,
        default: undefined,
      },
    },

    data: () => ({
      shareUrl: undefined,
    }),

    mounted () {
      this.shareUrl = window.location.href
    },

    methods: {
      async copyToClipBoard () {
        try {
          await navigator.clipboard.writeText(this.shareUrl)
        } catch (err) {
          throw new Error('Error: Copy to clipboard')
        }
      },
    },
  }
</script>

<style src="./ProjectShare.scss" lang="scss"/>
