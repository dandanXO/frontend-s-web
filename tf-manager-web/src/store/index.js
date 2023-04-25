import { ref } from "vue";
import { createStore, createLogger } from 'vuex'
import { store as app } from '@/store/modules/app'
import { store as menu } from '@/store/modules/menu'
import { store as user } from '@/store/modules/user'
import { store as socket } from '@/store/modules/socket'
import vueI18n from "@/i18n";
import { defineStore } from "pinia";

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
    menu,
    socket
  }
})

export function useStore() {
  return store
}

export const i18nStore = defineStore("i18nStore", () => {
  const languageLocale = localStorage.getItem("languageLocale") || "en";
  const languageVal = ref(languageLocale);
  function setLanguage(l) {
    languageVal.value = l;
    // when vue-i18n is being used with legacy: false, note that i18n.global.locale is a ref, so we must set it via .value:
    vueI18n.global.locale.value = l;

    // otherwise - when using legacy: true, we set it like this:
    // vueI18n.global.locale = l;
    localStorage.setItem("languageLocale", l);
  }
  return { languageVal, setLanguage };
});
