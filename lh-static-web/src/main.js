import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import AOS from "aos";
import { fpjsPlugin } from "@fingerprintjs/fingerprintjs-pro-vue-v3";

import "aos/dist/aos.css";
import "@/scss/common.scss";
import "ant-design-vue/dist/antd.css";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

const app = createApp(App);

app
  .use(createPinia())
  .use(AOS.init())
  .use(router)
  .use(Antd)
  .use(ElementPlus, {
    locale: zhCn
  })
  .use(fpjsPlugin, {
    loadOptions: {
      apiKey: "b1A4V9htZ4ySmb8ycMQb",
      region: "ap"
    }
  })
  .mount("#app");
