export default ({ store }) => {
  const konamiCodes = [
    'arrowup',
    'arrowup',
    'arrowdown',
    'arrowdown',
    'arrowleft',
    'arrowright',
    'arrowleft',
    'arrowright',
    'b',
    'a',
  ]

  let index = 0

  document.onkeydown = function (e) {
    e.preventDefault()

    const key = e.key.toLowerCase()

    if (key === konamiCodes[index]) {
      index++
      if (index === konamiCodes.length) {
        const experimentalFeatureEnabled = store.getters['ui/showExperimentalFeatures']
        store.commit('ui/SET_SHOW_EXPERIMENTAL_FEATURES', !experimentalFeatureEnabled)
        index = 0
      }
    } else {
      index = 0
    }
  }
}
