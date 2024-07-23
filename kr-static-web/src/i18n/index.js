import { createI18n } from "vue-i18n";
import en from "./en";
import kr from "./kr";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || "kr",
  // allowComposition: true,
  messages: {
    en,
    kr
  },
  globalInjection: true,
});
export default i18n;
