import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from "pinia";
import ElementPlus from 'element-plus'
import vueI18n from "./i18n";
import AOS from "aos";
import { fpjsPlugin } from "@fingerprintjs/fingerprintjs-pro-vue-v3";

import "aos/dist/aos.css";
import "@/scss/common.scss";
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
const app = createApp(App);

app
    .use(createPinia())
    .use(AOS.init())
    .use(router)
    .use(ElementPlus)
    .use(vueI18n)
  .use(fpjsPlugin, {
    loadOptions: {
      apiKey: "b1A4V9htZ4ySmb8ycMQb",
      region: "ap"
    }
  })
    .mount("#app");

