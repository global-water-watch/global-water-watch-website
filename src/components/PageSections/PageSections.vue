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
  import RelatedSection from '@/components/PageSections/RelatedSection/RelatedSection'
  import TabsSection from '@/components/PageSections/TabsSection/TabsSection'
  import TextSection from '@/components/PageSections/TextSection/TextSection'
  import TimelineSection from '@/components/PageSections/TimelineSection/TimelineSection'
  import ImageTextSection from '@/components/PageSections/ImageTextSection/ImageTextSection'
  import BlogTags from '@/components/BlogTags/BlogTags'

  const componentsByType = {
    blog_quote: QuoteSection,
    blog_text_section: TextSection,
    logo_section: LogoSection,
    multi_text_section: MultiTextSection,
    newsletter_section: NewsletterSection,
    people_section: PeopleSection,
    related_section: RelatedSection,
    tabs_section: TabsSection,
    timeline_section: TimelineSection,
    image_text_section: ImageTextSection,
  }
  const supportedTypes = Object.keys(componentsByType)

  export default {
    components: {
      LogoSection,
      MultiTextSection,
      NewsletterSection,
      PeopleSection,
      RelatedSection,
      TabsSection,
      TextSection,
      TimelineSection,
      ImageTextSection,
      BlogTags,
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
      blogTags: {
        type: Array,
        default: undefined,
      },
    },
    computed: {
      items () {
        const sections = this.sections
          .filter(section => componentsByType[section._modelApiKey])
          .map((section, index) => {
            const id = `section-${section.id || index}`
            return {
              key: id,
              Component: componentsByType[section._modelApiKey],
              props: { ...section, id },
            }
          })

        if (this.blogTags && this.blogTags.length) {
          const relatedSection = sections.find(({ props }) => props._modelApiKey === 'related_section')
          const index = sections.indexOf(relatedSection)
          const id = 'section-blog-tags'
          const component = { key: id, Component: BlogTags, props: { tags: this.blogTags, id } }

          if (index > -1) {
            sections.splice(index, 0, component)
          } else {
            sections.push(component)
          }
        }

        return sections
      },
    },
  }
</script>
