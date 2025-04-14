import { mutations } from './mutations'
import { actions } from './actions'
import { state } from './state'

export const store = {
  state,
  mutations,
  actions
  // TODO: With namespaced option turned on, having problem how to use dispatch with action types...
  // But without it, a bigger store might have clashes in namings
  // namespaced: true,
}
