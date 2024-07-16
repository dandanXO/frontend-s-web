import { createI18n } from "vue-i18n";
import vi from "./vi";
import cn from "./cn";
import en from "./en";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || "vi",
  allowComposition: true,
  messages: {
    vi,
    en,
    cn
  },
  globalInjection: true
});
export default i18n;
