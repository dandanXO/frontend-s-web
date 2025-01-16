import { createI18n } from "vue-i18n";
import bn from "./bn";
import en from "./en";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || "bn",
  allowComposition: true,
  messages: {
    bn,
    en
  },
  globalInjection: true
});
export default i18n;
