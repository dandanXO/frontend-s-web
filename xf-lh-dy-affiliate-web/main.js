import { createApp } from "vue";
import vueI18n from "./i18n";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import "@/assets/iconfont/iconfont.css";
import "@/styles/index.scss";
import 'element-plus/theme-chalk/index.css'
import "normalize.css";
import * as directives from "@/directives";
import "@/permission";
import "@/icons";
import SvgIcon from "@/components/SvgIcon/index.vue";
import ElementPlus from 'element-plus'
import { createPinia } from "pinia";
import dayjs from 'dayjs';

dayjs.Ls.en.weekStart = 1;
const app = createApp(App);
app.use(ElementPlus)

app.component("SvgIcon", SvgIcon);

Object.keys(directives).forEach(key => {
  app.directive(key, directives[key]);
});

app.use(createPinia()).use(vueI18n).use(store).use(router).mount("#app");
