import { boot } from "quasar/wrappers";
import { createI18n } from "vue-i18n";
import messages from "src/cs-client-web/i18n";

const i18n = createI18n({
  locale: "zh-CN",
  globalInjection: true,
  messages,
  legacy: false
});

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n);
});

const t = i18n.global.t;

export { i18n, t };
