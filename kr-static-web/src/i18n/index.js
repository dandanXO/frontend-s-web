import { createI18n } from "vue-i18n";
import en from "./en";
import kr from "./kr";
import vi from "./vi";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || "kr",
  // allowComposition: true,
  messages: {
    en,
    kr,
    vi
  },
  globalInjection: true
});
export default i18n;
