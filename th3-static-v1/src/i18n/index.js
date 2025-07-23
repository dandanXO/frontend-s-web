import { createI18n } from "vue-i18n";
import ur from "./ur";
import en from "./en";
import th from "./th";
import cn from "./cn"
import { DEFAULT_LANG } from "src/constant/lang";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("languageLocale") || DEFAULT_LANG,
  allowComposition: true,
  messages: {
    ur,
    en,
    th,
    cn
  },
  globalInjection: true
});
export default i18n;
