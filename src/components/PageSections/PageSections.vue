<template>
  <Fragment>
    <Component
      :is="item.Component"
      v-for="item in items"
      :key="item.key"
      v-bind="item.props"
    />
  </Fragment>
</template>

<script>
  // @todo: consider NuxtDynamic https://dynamic.blokwise.io/usage#nuxtdynamic
  import LogoSection from '@/components/PageSections/LogoSection/LogoSection'
  import MultiTextSection from '@/components/PageSections/MultiTextSection/MultiTextSection'
  import NewsletterSection from '@/components/PageSections/NewsletterSection/NewsletterSection'
  import PeopleSection from '@/components/PageSections/PeopleSection/PeopleSection'
  import QuoteSection from '@/components/PageSections/QuoteSection/QuoteSection'
  import TabsSection from '@/components/PageSections/TabsSection/TabsSection'
  import TextSection from '@/components/PageSections/TextSection/TextSection'
  import TimelineSection from '@/components/PageSections/TimelineSection/TimelineSection'

  const componentsByType = {
    blog_quote: QuoteSection,
    blog_text_section: TextSection,
    logo_section: LogoSection,
    multi_text_section: MultiTextSection,
    newsletter_section: NewsletterSection,
    people_section: PeopleSection,
    tabs_section: TabsSection,
    timeline_section: TimelineSection,
  }
  const supportedTypes = Object.keys(componentsByType)

  export default {
    components: {
      LogoSection,
      MultiTextSection,
      NewsletterSection,
      PeopleSection,
      TabsSection,
      TextSection,
      TimelineSection,
    },
    props: {
      sections: {
        type: Array,
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
