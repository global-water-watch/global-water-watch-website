<template>
  <DatocmsStructuredText
    class="structured-text"
    :data="text"
    :render-link-to-record="renderLinkToRecord"
    :render-inline-record="renderInlineLinkToRecord"
    :custom-rules="customRules"
  />
</template>

<script>
  import { h } from 'vue-demi'
  import { renderRule } from 'vue-datocms'
  import { isLink } from 'datocms-structured-text-utils'

  export default {
    props: {
      text: {
        type: Object,
        default: () => {},
      },
      linkAttributes: {
        type: Object,
        default: () => {},
      },
      links: {
        type: Array,
        default: () => [],
      },
    },
    computed: {
      customRules () {
        return [
          renderRule(isLink, ({ adapter: { renderNode: h }, node, children }) => {
            return h('a', { href: node.url, target: '_blank' }, children)
          }),
        ]
      },
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
      renderInlineLinkToRecord: ({ record }) => {
        return h('NuxtLink', { to: record?.route, ...this.linkAttributes }, record.title)
      },
    },
  }
</script>

<style src="./StructuredText.scss" lang="scss"></style>
