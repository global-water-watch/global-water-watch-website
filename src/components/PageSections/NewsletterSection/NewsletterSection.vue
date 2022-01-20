<template>
  <section :id="id" class="newsletter-section layout-section layout-section--lined layout-section--padded">
    <div class="layout-container layout-container--medium">
      <h2 class="h2 timeline-section__title">
        {{ title }}
      </h2>
      <StructuredText
        class="newsletter-section__text"
        :text="text"
        :render-link-to-record="renderLinkToRecord"
        :custom-rules="customRules"
      />

      <div class="newsletter-section__form">
        <NewsletterForm
          :action-url="mailchimpActionUrl"
          :honeypot-name="mailchimpHoneypotName"
        />
        <StructuredText
          class="newsletter-section__email-text small"
          :text="emailText"
          :render-link-to-record="renderLinkToRecord"
          :custom-rules="customRules"
        />
      </div>
    </div>
  </section>
</template>

<script>
  import { h } from 'vue-demi'
  import { renderRule } from 'vue-datocms'
  import { isLink } from 'datocms-structured-text-utils'
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
      emailText: {
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
      mailchimpActionUrl: {
        type: String,
        required: true,
      },
      mailchimpHoneypotName: {
        type: String,
        required: true,
      },
    },
    computed: {
      customRules: () => ([
        renderRule(isLink, ({ adapter: { renderNode: h }, node, children }) => {
          return h('a', { href: node.url, target: '_blank' }, children)
        }),
      ]),
    },
    methods: {
      renderLinkToRecord: ({ record, children }) => {
        switch (record.__typename) {
        case 'HomeRecord':
          return h('NuxtLink', { attrs: { to: '/' } }, children)
        case 'ArticleRecord':
          return h('NuxtLink', { attrs: { to: `/${record.slug}` } }, children)
        default:
          return null
        }
      },
    },
  }
</script>

<style src="./NewsletterSection.scss" lang="scss"></style>
