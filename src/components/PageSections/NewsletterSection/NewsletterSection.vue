<template>
  <section :id="id" class="newsletter-section layout-section layout-section--lined layout-section--padded">
    <div class="layout-container layout-container--medium">
      <h2 class="h2 timeline-section__title">
        {{ title }}
      </h2>
      <StructuredText
        class="newsletter-section__text"
        :text="text"
        :links="text.links"
      />

      <div class="newsletter-section__form">
        <NewsletterForm
          :action-url="sibActionUrl"
          :opt-in-text="optInText"
        />
      </div>
    </div>
  </section>
</template>

<script>
  import NewsletterForm from '@/components/NewsletterForm/NewsletterForm'

  export default {
    components: {
      NewsletterForm,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
      optInText: {
        type: Object,
        required: true,
      },
      text: {
        type: Object,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      sibActionUrl: {
        type: String,
        required: true,
      },
    },
  }
</script>

<style src="./NewsletterSection.scss" lang="scss"></style>
