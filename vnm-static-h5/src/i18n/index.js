import { createI18n } from "vue-i18n";
import vn from "./vn";
import cn from "./cn";
import en from "./en";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || "vn",
  allowComposition: true,
  messages: {
    vn,
    en,
    cn
  },
  globalInjection: true
});
export default i18n;
