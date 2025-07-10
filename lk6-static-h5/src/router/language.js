import { ref } from "vue";
import vueI18n from "../i18n";
import { defineStore } from "pinia";
import { DEFAULT_LANG } from "src/constant/lang";
import { useQuasar } from "quasar";

export const i18nStore = defineStore("i18nStore", () => {
  const languageLocale = localStorage.getItem("languageLocale") || DEFAULT_LANG;
  const languageVal = ref(languageLocale);
  const isLangInitialized = ref(false);
  const $q = useQuasar();

  async function setLanguage(l) {
    try {
      const quasarLang = l === "zh" ? "zh-CN" : l === "en" ? "en-US" : l;
      const langPack = await import(`quasar/lang/${quasarLang}`);

      $q.lang.set(langPack.default);
    } catch (e) {
      console.error("Error setting Quasar language:", e);
    }
    languageVal.value = l;
    // when vue-i18n is being used with legacy: false, note that i18n.global.locale is a ref, so we must set it via .value:
    vueI18n.global.locale.value = l;
    // otherwise - when using legacy: true, we set it like this:
    // vueI18n.global.locale = l;
    localStorage.setItem("languageLocale", l);
  }

  const initializeLang = (lang) => {
    setLanguage(lang);
    isLangInitialized.value = true;
  };
  return { languageVal, setLanguage, isLangInitialized, initializeLang };
});
