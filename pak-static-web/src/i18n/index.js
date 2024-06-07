import { createI18n } from "vue-i18n";
import en from "./locales/en";
import ur from "./locales/ur";

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || "ur",
  messages: {
    en,
    ur
  },
  globalInjection: true
});
