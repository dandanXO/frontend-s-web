import { createI18n } from "vue-i18n";
import en from "./en";
import vi from "./vi";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || "vi",
  // allowComposition: true,
  messages: {
    en,
    vi
  },
  globalInjection: true,
});
export default i18n;
