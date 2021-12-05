/**
 * @type {import('@nuxt/types').Plugin}
 */
export default function (context, inject) {
  const { $config, enablePreview, error, query, redirect, route } = context
  const { location = route.path, preview, secret } = query
  const pluginName = 'previewMode'

  // The `window.onNuxtReady(fn)` are needed to avoid hydration issues:
  // @see https://github.com/nuxt/nuxt.js/issues/4491#issuecomment-648979464
  const onReady = fn => window.onNuxtReady(() => fn())

  // Feature check for LocalStorage
  // @see https://mathiasbynens.be/notes/localstorage-pattern
  const storage = (() => {
    // eslint-disable-next-line new-parens
    const uid = new Date
    let storage
    let result
    try {
      (storage = window.localStorage).setItem(uid, uid)
      // eslint-disable-next-line eqeqeq
      result = storage.getItem(uid) == uid
      storage.removeItem(uid)
      return result && storage
    } catch (exception) {}
  })()

  const enterPreview = (data = {}) => {
    if (storage) {
      storage.setItem(pluginName, JSON.stringify(data))
    }
    enablePreview(data)
  }

  const exitPreview = () => {
    if (storage) {
      storage.removeItem(pluginName)
    }
    window.location.reload()
  }

  inject(pluginName, {
    exit: exitPreview,
  })

  if (storage && storage.getItem(pluginName)) {
    const data = JSON.parse(storage.getItem(pluginName))
    return enterPreview(data)
  }

  if (preview !== 'true') {
    // Not in preview mode, so we don't need to do anything.
    return
  }

  if (!$config.previewSecret) {
    return onReady(() => error({
      statusCode: 500,
      message: 'Set DATOCMS_READONLY_TOKEN to enable preview mode.',
    }))
  }

  if (secret !== $config.previewSecret) {
    return onReady(() => error({
      statusCode: 401,
      message: 'Invalid secret.',
    }))
  }

  enterPreview()

  return onReady(() => redirect(location))
}
