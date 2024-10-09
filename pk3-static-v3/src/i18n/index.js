import { createI18n } from "vue-i18n";
import en from "./en";
import id from "./id";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || "id",
  allowComposition: true,
  messages: {
    id,
    en
  },
  globalInjection: true
});
export default i18n;
