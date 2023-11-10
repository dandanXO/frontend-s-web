import { createI18n } from "vue-i18n";
import en from "./en";
import zh from "./zh";
import th from "./th";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || "en",
  // allowComposition: true,
  messages: {
    en,
    zh,
    th
  },
  globalInjection: true,
});
export default i18n;
