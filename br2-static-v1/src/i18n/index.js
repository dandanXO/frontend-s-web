import { createI18n } from "vue-i18n";
import pt from "./pt";
import en from "./en";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || "pt",
  allowComposition: true,
  messages: {
    pt,
    en
  },
  globalInjection: true
});
export default i18n;
