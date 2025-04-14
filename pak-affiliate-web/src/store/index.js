import { createStore, createLogger } from 'vuex'
import { store as app } from '@/store/modules/app'
import { store as menu } from '@/store/modules/menu'
import { store as user } from '@/store/modules/user'

// Plug in logger when in development environment
const debug = process.env.NODE_ENV !== 'production'
const plugins = debug ? [createLogger({})] : []
// Plug in session storage based persistence
// plugins.push(createPersistedState({ storage: window.sessionStorage }))

export const store = createStore({
  plugins,
  modules: {
    app,
    user,
    menu
  }
})

export function useStore() {
  return store
}
