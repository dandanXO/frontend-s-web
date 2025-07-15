import { createI18n } from "vue-i18n";
import en from "./en.json";
import zh from "./zh.json";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || "zh",
  // allowComposition: true,
  messages: {
    en,
    zh
  },
  globalInjection: true,
});
export default i18n;
