/**
 * Plugin :: Injects repository onto app context as `$repo`
 */

import createRepo from '@/repo'

/**
 * @type {import('@nuxt/types').Plugin}
 */
export default (ctx, inject) => {
  inject('repo', createRepo(ctx.$axios))
}
