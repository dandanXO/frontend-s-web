import { createI18n } from "vue-i18n";
import th from "./th";
import cn from "./cn";
import en from "./en";


const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || "th",
  allowComposition: true,
  messages: {
    th,
    en,
    cn
  },
  globalInjection: true,
});
export default i18n;
