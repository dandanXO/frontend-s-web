import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'

export const store = {
  state,
  mutations,
  actions
  // TODO: With namespaced option turned on, having problem how to use dispatch with action types...
  // But without it, a bigger store might have clashes in namings
  // namespaced: true,
}
