import defaultState from './state'
import mutations from './mutations'
import actions from './actions'

function state () {
  return defaultState()
}

export default {
  state,
  mutations,
  actions,
}
