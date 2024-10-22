import { createI18n } from "vue-i18n";
import vi from "./vi.json";
import en from "./en.json";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || "vi",
  allowComposition: true,
  messages: {
    vi,
    en
  },
  globalInjection: true
});
export default i18n;
