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
  import LogoSection from './LogoSection/LogoSection.vue'
  import MultiTextSection from './MultiTextSection/MultiTextSection.vue'
  import NewsletterSection from './NewsletterSection/NewsletterSection.vue'
  import PeopleSection from './PeopleSection/PeopleSection.vue'
  import TimelineSection from './TimelineSection/TimelineSection.vue'

  const componentsByType = {
    logo_section: LogoSection,
    multi_text_section: MultiTextSection,
    newsletter_section: NewsletterSection,
    people_section: PeopleSection,
    timeline_section: TimelineSection,
  }
  const supportedTypes = Object.keys(componentsByType)

  export default {
    // components: Object.values(componentsByType).reduce((out, Component) => ({ ...out, Component }), {}),
    components: {
      LogoSection,
      MultiTextSection,
      NewsletterSection,
      PeopleSection,
      TimelineSection,
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
    data () {
      return {
        items: this.sections
          .filter(section => componentsByType[section._modelApiKey])
          .map((section, index) => {
            const id = `section-${section.id || index}`
            return {
              key: id,
              Component: componentsByType[section._modelApiKey],
              props: { ...section, id },
            }
          }),
      }
    },
  }
</script>
