import { state } from './state'
import { mutations } from './mutations'

export const store = {
  state,
  mutations
  // TODO: With namespaced option turned on, having problem how to use dispatch with action types...
  // But without it, a bigger store might have clashes in namings
  // namespaced: true,
}
