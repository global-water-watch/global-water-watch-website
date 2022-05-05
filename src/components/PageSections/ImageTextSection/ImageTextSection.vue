<template>
  <section
    :id="id"
    class="text-image-section layout-section layout-section--padded"
    :class="themeClass"
  >
    <div class="layout-container">
      <div class="text-image-section__wrapper">
        <v-container fluid>
          <v-row no-gutters :class="{'flex-row-reverse': reverse}">
            <v-col class="col-12 col-md-6">
              <ResponsiveVideo v-if="Boolean(video)" :video="video" />
              <ResponsiveImage
                v-if="Boolean(image)"
                :image="image"
                :contain="true"
              />
            </v-col>

            <v-col class="col-12 col-md-6">
              <div class="text-image-section__text">
                <h3 class="h2">
                  {{ text[0].title }}
                </h3>
                <StructuredText
                  :text="text[0].text"
                  :links="text[0].text.links"
                />
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <div class="text-image-section__action">
        <AppLink
          v-if="transformedLink"
          :link="transformedLink"
          class="v-btn v-btn--has-bg v-size--default primary"
        >
          {{ transformedLink.title }}
        </AppLink>
      </div>
    </div>
  </section>
</template>

<script>
  import ResponsiveImage from '@/components/ResponsiveImage/ResponsiveImage'
  import ResponsiveVideo from '@/components/ResponsiveVideo/ResponsiveVideo'

  export default {
    components: {
      ResponsiveImage,
      ResponsiveVideo,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
      theme: {
        type: Object,
        default: () => {},
      },
      reverse: {
        type: Boolean,
        required: true,
      },
      text: {
        type: Array,
        required: true,
      },
      image: {
        type: Object,
        default: () => {},
      },
      video: {
        type: Object,
        default: () => {},
      },
      link: {
        type: Array,
        default: undefined,
      },
    },

    computed: {
      themeClass () {
        return (this.theme && this.theme.slug === 'highlight')
          ? 'layout-section--blue'
          : 'layout-section--lined'
      },

      transformedLink () {
        return (this.link && this.link.length) ? this.link[0] : undefined
      },
    },
  }
</script>

<style src="./ImageTextSection.scss" lang="scss"></style>
