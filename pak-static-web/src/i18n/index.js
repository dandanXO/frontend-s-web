import { createI18n } from "vue-i18n";
import en from "./locales/en";
import ur from "./locales/ur";
import { LANGUAGE_DEFAULT_VALUE, LANGUAGE_KEY } from "@/constant/localStorage";

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem(LANGUAGE_KEY) || LANGUAGE_DEFAULT_VALUE,
  messages: {
    en,
    ur
  },
  globalInjection: true
});
