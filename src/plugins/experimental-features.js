export default ({ store }) => {
  document.onkeydown = function (e) {
    if (e.key === 'p' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
      e.preventDefault()
      const experimentalFeatureEnabled = store.getters['ui/showExperimentalFeatures']
      store.commit('ui/SET_SHOW_EXPERIMENTAL_FEATURES', !experimentalFeatureEnabled)
    }
  }
}
