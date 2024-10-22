import { createI18n } from "vue-i18n";
import en from "./en.json";
import vi from "./vi.json";

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
