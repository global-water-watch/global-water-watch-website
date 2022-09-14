<template>
  <section
    :id="id"
    class="tabs-section layout-section layout-section--padded"
    :class="themeClass"
  >
    <div class="layout-container">
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab v-for="item in items" :key="item.id">
          {{ item.handle }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="item in items"
          :key="item.id"
          class="tabs-section__tab"
        >
          <v-container fluid>
            <v-row no-gutters>
              <v-col class="col-12 col-md-6">
                <ResponsiveVideo v-if="Boolean(item.video)" :video="item.video" />
                <ResponsiveImage
                  v-if="Boolean(item.image)"
                  :image="item.image"
                  :contain="true"
                />
              </v-col>

              <v-col class="col-12 col-md-6">
                <h3 class="h2">
                  {{ item.text[0].title }}
                </h3>
                <StructuredText
                  :text="item.text[0].text"
                  :links="item.text[0].text.links"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
      </v-tabs-items>

      <div class="tabs-section__action">
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
      items: {
        type: Array,
        required: true,
      },
      theme: {
        type: Object,
        default: () => {},
      },
      link: {
        type: Array,
        default: undefined,
      },
    },

    data () {
      return {
        tab: null,
      }
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

<style src="./TabsSection.scss" lang="scss"></style>
