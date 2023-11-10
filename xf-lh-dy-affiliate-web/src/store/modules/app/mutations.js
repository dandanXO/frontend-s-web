import { AppMutationTypes } from './mutation-types'
import { setSidebarStatus } from '@/utils/cookies'

export const mutations = {
  [AppMutationTypes.TOGGLE_SIDEBAR](state, withoutAnimation) {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = withoutAnimation
    if (state.sidebar.opened) {
      setSidebarStatus('opened')
    } else {
      setSidebarStatus('closed')
    }
  },

  [AppMutationTypes.CLOSE_SIDEBAR](state, withoutAnimation) {
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
    setSidebarStatus('closed')
  },

  [AppMutationTypes.TOGGLE_DEVICE](state, device) {
    state.device = device
  }
}
