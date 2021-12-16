/**
 * Nuxt2 DatoCMS Plugin
 *
 * features:
 * - $datocms.fetchData: lightweight isomorphic data fetching of GraphQL queries
 * - $datocms.subscribeToData: real-time data updates using GraphQL queries
 * - $datocms.state: { error, status, statusMessage } for data subscription
 * - $datocms.toHead: alias for vue-datocms' toHead method
 * - <DatocmsImage>: global alias for vue-datocms's Image component
 * - <DatocmsStructuredText>: global alias for vue-datocms's StructuredText component
 */
import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import fetch from 'isomorphic-unfetch'
import { subscribeToQuery } from 'datocms-listen'
import { Image, StructuredText, toHead } from 'vue-datocms'

Vue.component('DatocmsImage', Image)
Vue.component('DatocmsStructuredText', StructuredText)
Vue.use(Vuex)

const statusMessage = {
  connecting: 'Connecting to DatoCMS...',
  connected: 'Connected to DatoCMS, receiving live updates!',
  closed: 'Connection closed.',
}

/**
 * @type {import('@nuxt/types').Plugin}
 */
export default ({ $config, app }, inject) => {
  const store = new Store({
    state: {
      error: null,
      status: 'connecting',
      statusMessage: statusMessage.connecting,
    },
    mutations: {
      setError (state, { error }) {
        state.error = error
        return state
      },
      setStatus (state, { status }) {
        state.statusMessage = statusMessage[status]
        state.status = status
        return state
      },
    },
  })

  let unsubscribes = []

  const unsubscribeAll = () => {
    unsubscribes.forEach(unsubscribe => unsubscribe())
    unsubscribes = []
  }

  app.router.afterEach(() => {
    if (unsubscribes.length > 0) {
      unsubscribeAll()
    }
  })

  inject('datocms', {
    toHead,

    state: store.state,

    async fetchData ({ query, variables = {}, preview = false }) {
      const endpoint = preview
        ? 'https://graphql.datocms.com/preview'
        : 'https://graphql.datocms.com/'

      const response = await fetch(endpoint, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: $config.datocmsReadonlyToken,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      }).then(response => response.json())

      if (response.errors) {
        throw JSON.stringify(response.errors)
      }

      return response.data
    },

    async subscribeToData ({ query, variables = {}, onData, isEnabled = app.context.$preview }) {
      if (!isEnabled) { return false }

      const unsubscribe = await subscribeToQuery({
        baseUrl: 'https://graphql-listen.datocms.com',
        token: $config.datocmsReadonlyToken,
        query,
        variables,
        preview: true,
        onUpdate: (update) => {
          onData(update.response.data)
        },
        onStatusChange: (status) => {
          store.commit('setStatus', { status })
        },
        onChannelError: (error) => {
          store.commit('setError', { error })
        },
      })

      unsubscribes.push(unsubscribe)
    },

  })
}
