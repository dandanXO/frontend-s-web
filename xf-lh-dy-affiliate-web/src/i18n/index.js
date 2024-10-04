import { createI18n } from "vue-i18n";
import en from "./en";
import zh from "./zh";
import th from "./th";
import vi from "./vi";
import kr from "./kr";
import pt from "./pt";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || "en",
  // allowComposition: true,
  messages: {
    en,
    zh,
    th,
    vi,
    kr,
    pt
  },
  globalInjection: true,
});
export default i18n;
