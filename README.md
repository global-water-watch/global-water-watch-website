# Global Water Watch Website

[![Website](https://img.shields.io/website?url=http%3A%2F%2Fwww.globalwaterwatch.io%2F)](https://www.globalwaterwatch.io/)

- [**Landing page**](https://www.globalwaterwatch.io/) (start 2022)
- **Full-fledged site** (later in 2022)
- **Interactive geo app** (tbd)


## Getting started

This project requires [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) to be installed. To get started:

```bash
# create env file, and set the variables
cp .env.example .env

# install dependencies
yarn
```

Ask a team member how to obtain the required env variables.

See [available scripts](#scripts) (like `yarn dev`) below.


## Architecture

The site is created as lightweight isomorphic website connected to a headless CMS, so that it can grow from a landing page to a full-fledged site including a geo app. The setup includes:

- [Nuxt](https://nuxtjs.org) - a meta framework based on Vue - is used to structure the project. This framework is selected as it's very suitable for both the highly interactive parts as well as mostly static pages. Since the framework is based on Vue many integrations and libraries are available to speed up development.
- [DatoCMS](https://www.datocms.com/) - the site content is managed in a [headless DatoCMS instance](https://global-water-watch-website.admin.datocms.com/) (on Deltares account). DatoCMS is selected for its modular and structured content options, advanced image service, multi-language support and GraphQL API. [`vue-datocms`](https://github.com/datocms/vue-datocms) provides handy Vue components and utilties for DatoCMS data.
- [Vuetify](https://vuetifyjs.com/en/) - is a UI component library in Material Design style. It enables us to quickly build a UI without much custom design work. It is configured to use the [Deltares theme](https://github.com/openearth/delta-vue-components/tree/master/packages/vuetify-theme).
- [Deltares Vue Components](https://github.com/openearth/delta-vue-components/tree/master/packages/vue-components) - is a collection of Deltares specific components like `LegalDialog` and `MapboxMap`.
- [Netlify](https://www.netlify.com/) - is used as hosting platform. It is selected for its worldwide CDN, built-in CI/CD and convenient preview environment for each PR. [Netlify Dev](https://www.netlify.com/products/dev/) is used to bring the local development experience as close to production as possible.
- [Yarn](yarnpkg.com/) - is used as package manager instead of npm as it boosts faster builds.


### Directory structure

This package uses Nuxt's default directory structure. A component's file (`*.vue`) and optional data structure (`*.fragment.graphql`) are bundled in a directory with the name of the component. Pages typically also have an adjoining `*.query.graphql` file for [data loading](#cms-data-loading).

```
src/
  assets/icons/
  components/
    Example/
      index.js
      Example.vue
      Example.fragment.graphql

  pages/
    _param/
      index.vue
      index.query.graphql

  static/
    fonts/
    images/
```

### CMS data loading

The Nuxt app is connected to the CMS via the [DatoCMS GraphQL API](https://www.datocms.com/docs/content-delivery-api). To make data loading simple, this project uses [`graphql-loader`](https://www.npmjs.com/package/webpack-graphql-loader), a custom `$datocms` plugin for data fetching and live previews. Together these enable us to put `*.query.graphql` files next to our page templates (`*.vue`), load them directly and use the helper to fetch the data:

```vue
<template>
  <div>
    <h1>{{ page.title }}</h1>
    <DatocmsImage :data="page.image.responsiveImage" />
  </div>
</template>

<script>
import query from './index.query.graphql'

export default {
  async asyncData ({ $datocms, $preview }) {
    const { page } = await $datocms.fetchData({ query, preview: !!$preview })
    return { page }
  },
  head () {
    return this.$datocms.toHead(this.page.seo)
  },
  mounted () {
    if (this.$nuxt.isPreview) {
      this.$datocms.subscribeToData({
        query,
        onData: ({ page }) => { this.page = page },
      })
    }
  },
}
</script>
```

Where a simple `index.query.graphql` could look like:

```graphql
#import '../components/ResponsiveImage/ResponsiveImage.fragment.graphql'

query ExampleQuery($locale: SiteLocale) {
  page: examplePage(locale: $locale) {
    title
    seo: _seoMetaTags { attributes, content, tag }
    image {
        responsiveImage(
          imgixParams: { fit: crop, w: 300, h: 300, auto: format }
        ) {
          ...responsiveImageFragment
        }
      }
  }
}
```

- You can pass [variables](https://graphql.org/learn/queries/#variables) into `$datocms.request` and use them in the query.
- You can reuse repeating [fragments](https://graphql.org/learn/queries/#fragments) in their own files, like for example [ResponsiveImage](components/ResponsiveImage.fragment.graphql).
- You can copy-paste your GraphQL queries to and from the [API explorer](https://global-water-watch-website.admin.datocms.com/cda-explorer) to test them in isolation.
- You get full IntelliSense (autocomplete and validation) in `.graphql` files with the [VSCode GraphQL Extension](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)

### Preview mode

Finally you can view unpublished content by enabling preview mode. Navigate to `/?preview=true&secret={PREVIEW_MODE_SECRET}` or follow preview links from the CMS to enable it.


## Scripts

`yarn ...` | task
--- | ---
`dev` | starts development server on [`localhost:4999`](http://localhost:4999) (is "GWWW" in "T9")
`dev:netlify` | starts development server in Netlify setup on [`localhost:4999`](http://localhost:4999), more realistic, less DX.
`analyze` | analyzes and visualizes output bundles
`build` | creates optimised production build
`start` | starts local server to test production build

---

## Release to production

Follow these steps in order to release a new version to production:

1. Make a new pull request to merge `development` into `main`
2. Use the preview to check that everything works correctly in the new version
3. Merge the pull request
4. Draft a new release
    1. Set `main` as the target
    2. Create a new tag by increasing the version number
    3. Set the release title to "Release ${version}"
    4. Automatically generate release notes
    5. Publish the release
5. Congrats! Check Netlify for updates on the deploy process

