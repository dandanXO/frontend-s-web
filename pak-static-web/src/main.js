import { createApp, watchEffect } from "vue";
import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import { createPinia } from "pinia";
import * as directives from "@/directives";
import VueSnip from "vue-snip";
import AOS from "aos";
import ElementPlus from "element-plus";
import "vue3-carousel/dist/carousel.css";
import "aos/dist/aos.css";
import "@/assets/fonts/font.scss";
import "normalize.css/normalize.css";
import "ant-design-vue/dist/antd.css";
import "@/assets/css/base.scss";
import "@/assets/css/common.scss";
import "animate.css";
import { globalStore } from "@/store";

import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { i18n } from "./i18n/index";

const app = createApp(App);
Object.keys(directives).forEach((key) => {
  app.directive(key, directives[key]);
});
// Watch for changes in the global store and update the body class
watchEffect(() => {
  document.body.classList.toggle("dark-theme", globalStore.isDarkMode);
});

app.provide("globalStore", globalStore);
app
  .use(createPinia())
  .use(AOS.init())
  .use(router)
  .use(Antd)
  .use(i18n)
  .use(VueSnip)
  .use(ElementPlus, {
    locale: zhCn
  })
  .mount("#app");
