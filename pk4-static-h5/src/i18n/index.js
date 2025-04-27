import { createI18n } from "vue-i18n";
import ur from "./ur";
import en from "./en";
import { DEFAULT_LANG } from "src/constant/lang";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || DEFAULT_LANG,
  allowComposition: true,
  messages: {
    ur,
    en
  },
  globalInjection: true
});
export default i18n;
