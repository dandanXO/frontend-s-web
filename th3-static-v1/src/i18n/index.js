import { createI18n } from "vue-i18n";
import en from "./en";
import th from "./th";
import zh from "./zh";
import { DEFAULT_LANG } from "src/constant/lang";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || DEFAULT_LANG,
  allowComposition: true,
  messages: {
    en,
    th,
    zh
  },
  globalInjection: true
});
export default i18n;
