import { createI18n } from "vue-i18n";
import en from "./en";
import zh from "./zh";
import th from "./th";
import kr from "./kr";
import vn from "./vn";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || "en",
  // allowComposition: true,
  messages: {
    en,
    zh,
    th,
    kr,
    vn
  },
  globalInjection: true,
});
export default i18n;
