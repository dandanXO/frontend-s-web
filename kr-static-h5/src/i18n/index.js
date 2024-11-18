import { createI18n } from "vue-i18n";
import kr from "./kr";
import cn from "./cn";
import en from "./en";
import vi from "./vi";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || "kr",
  allowComposition: true,
  messages: {
    kr,
    en,
    cn,
    vi
  },
  globalInjection: true
});
export default i18n;
