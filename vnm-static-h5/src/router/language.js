import { ref } from "vue";
import vueI18n from "../i18n";
import { defineStore } from "pinia";

export const i18nStore = defineStore("i18nStore", () => {
  const languageLocale = localStorage.getItem("languageLocale") || "vi";
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
