<template>
  <section :id="id" class="layout-section layout-section--padded layout-section--lined text-section">
    <div class="layout-container">
      <StructuredText
        class="text-section__text"
        :text="text"
        :render-link-to-record="renderLinkToRecord"
        :custom-rules="customRules"
      />
    </div>
  </section>
</template>

<script>
  import { h } from 'vue-demi'
  import { renderRule } from 'vue-datocms'
  import { isLink } from 'datocms-structured-text-utils'

  export default {
    props: {
      id: {
        type: String,
        required: true,
      },
      text: {
        type: Object,
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
