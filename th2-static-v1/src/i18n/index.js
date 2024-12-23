import { createI18n } from "vue-i18n";
import en from "./en";
import th from "./th";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || "th",
  allowComposition: true,
  messages: {
    th,
    en
  },
  globalInjection: true
});
export default i18n;
