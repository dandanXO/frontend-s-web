import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import { createPinia } from "pinia";
import * as directives from "@/directives";
import VueSnip from "vue-snip";
import AOS from "aos";
import "vue3-carousel/dist/carousel.css";
import "aos/dist/aos.css";
import "@/assets/fonts/font.scss";
import "normalize.css/normalize.css";
import "ant-design-vue/dist/antd.css";
import "@/assets/css/base.scss";
import "@/assets/css/common.scss";
import "animate.css";

const app = createApp(App);
Object.keys(directives).forEach((key) => {
  app.directive(key, directives[key]);
});

app
  .use(createPinia())
  .use(AOS.init())
  .use(router)
  .use(Antd)
  .use(VueSnip)
  .mount("#app");
