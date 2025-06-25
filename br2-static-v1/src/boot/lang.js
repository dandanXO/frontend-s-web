import { boot } from "quasar/wrappers";
import i18n from "../i18n/index";

export default boot(({ app }) => {
  app.use(i18n);
  app.config.globalProperties.$i18n = i18n;
});

const t = i18n.global.t;

export { i18n, t };
