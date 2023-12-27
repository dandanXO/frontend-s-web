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
import { Socket } from "./utils/socket";
import { createPinia } from "pinia";
import dayjs from 'dayjs';
import axios from "axios";

dayjs.Ls.en.weekStart = 1;
const app = createApp(App);
app.use(ElementPlus)

const currentHost = window.location.host
const baseApi = currentHost === process.env.VUE_APP_IND_HOST ? process.env.VUE_APP_IND_API : (currentHost === process.env.VUE_APP_TH_HOST ? process.env.VUE_APP_TH_API : process.env.VUE_APP_BASE_API);
const baseWss = currentHost === process.env.VUE_APP_IND_HOST ? process.env.VUE_APP_IND_SOCKET : (currentHost === process.env.VUE_APP_TH_HOST ? process.env.VUE_APP_TH_SOCKET : process.env.VUE_APP_SOCKET);

var hasUrl = false;
if (baseApi.indexOf(",") > -1) {
  const urls = baseApi.split(",");
  hasUrl = false;
  urls.forEach((url, ind) => {
    axios.get(url + "/ping").then((res) => {
      // console.log(res);
      if (res.status !== 200) {
      } else {
        putBaseUrl(url, ind);
      }
    }).catch((err) => {
      console.log(err);
    })
  });
} else {
  hasUrl = true;
  app.config.globalProperties.$baseApi = baseApi;
  app.config.globalProperties.$baseWss = baseWss;

  sessionStorage.setItem("baseApi", baseApi);
}

function putBaseUrl(url, index) {
  if (hasUrl === false) {
    console.log(url);
    const wsss = baseWss.split(",")
    hasUrl = true;

    sessionStorage.setItem("baseApi", url);

    app.config.globalProperties.$baseApi = url;
    app.config.globalProperties.$baseWss = wsss[index];
  }
}

app.component("SvgIcon", SvgIcon);

Object.keys(directives).forEach(key => {
  app.directive(key, directives[key]);
});

const socket = new Socket(store);
app.config.globalProperties.$socket = socket

app.use(createPinia()).use(vueI18n).use(store).use(router).mount("#app");

const globals = app.config.globalProperties;
export { globals }
