import { ref } from "vue";
import vueI18n from "../i18n";
import { defineStore } from "pinia";
import { Quasar } from "quasar";
import zhCN from "quasar/lang/zh-CN";
import enUs from "quasar/lang/en-US";
import th from "quasar/lang/th";

const quasarLangMap = {
  zh: zhCN,
  en: enUs,
  th: th
};

export const i18nStore = defineStore("i18nStore", () => {
  const languageLocale = localStorage.getItem("languageLocale") || "en";
  const languageVal = ref(languageLocale);
  const isLangInitialized = ref(false);

  function setLanguage(l) {
    languageVal.value = l;
    // when vue-i18n is being used with legacy: false, note that i18n.global.locale is a ref, so we must set it via .value:
    vueI18n.global.locale.value = l;

    const quasarLang = quasarLangMap[l];
    if (quasarLang) {
      Quasar.lang.set(quasarLang);
    } else {
      console.warn(`No Quasar language pack found for locale: ${l}`);
    }
    Quasar.lang.set(quasarLang);

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
