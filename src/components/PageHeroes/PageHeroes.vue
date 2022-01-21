<!-- eslint-disable vue/attributes-order -->
<template>
  <Fragment>
    <Component
      v-for="item in items"
      :key="item.key"
      :is="item.Component"
      v-bind="item.props"
    />
  </Fragment>
</template>

<script>
// @todo: consider NuxtDynamic https://dynamic.blokwise.io/usage#nuxtdynamic
// @todo: consider shared PageModules component to be used by PageHeroes & PageSections
  import BrandHero from './BrandHero/BrandHero.vue'
  import BlogHero from './BlogHero/BlogHero.vue'

  const componentsByType = {
    brand_hero: BrandHero,
    blog_hero: BlogHero,
  }
  const supportedTypes = Object.keys(componentsByType)

  export default {
    // components: Object.values(componentsByType).reduce((out, Component) => ({ ...out, Component }), {}),
    components: {
      BrandHero,
      BlogHero,
    },
    props: {
      sections: {
        required: true,
        validator (sections) {
          if (!Array.isArray(sections)) { return false }
          return sections.every(({ _modelApiKey: m }) => supportedTypes.includes(m))
        },
      },
    },
    computed: {
      items () {
        return this.sections
          .filter(section => componentsByType[section._modelApiKey])
          .map((section, index) => {
            const id = `section-${section.id || index}`
            return {
              key: id,
              Component: componentsByType[section._modelApiKey],
              props: { ...section, id },
            }
          })
      },
    },
  }
</script>
