import { createI18n } from "vue-i18n";
import en from "./en";
import ur from "./ur";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || "en",
  allowComposition: true,
  messages: {
    ur,
    en
  },
  globalInjection: true
});
export default i18n;
