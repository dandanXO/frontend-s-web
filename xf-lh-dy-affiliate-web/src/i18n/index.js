import { createI18n } from "vue-i18n";
import en from "./en";
import zh from "./zh";
import th from "./th";
import vi from "./vi";
import kr from "./kr";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || "en",
  // allowComposition: true,
  messages: {
    en,
    zh,
    th,
    vi,
    kr
  },
  globalInjection: true,
});
export default i18n;
