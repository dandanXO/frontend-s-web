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

var currentHost = window.location.host
let baseApi;
let baseWss;

let siteId;

console.log(currentHost);
// currentHost = "ka1-manager.wermop342ox.com";
switch (currentHost) {
  case process.env.VUE_APP_IW2_HOST:
    baseApi = process.env.VUE_APP_IW2_API;
    baseWss = process.env.VUE_APP_IW2_SOCKET;
    siteId = 'iw2';
    break;
  case process.env.VUE_APP_IND_HOST:
    baseApi = process.env.VUE_APP_IND_API;
    baseWss = process.env.VUE_APP_IND_SOCKET;
    siteId = 'ind';
    break;
  case process.env.VUE_APP_LH_HOST:
    baseApi = process.env.VUE_APP_LH_API;
    baseWss = process.env.VUE_APP_LH_SOCKET;
    siteId = 'lh';
    break;
  case process.env.VUE_APP_TH_HOST:
    baseApi = process.env.VUE_APP_TH_API;
    baseWss = process.env.VUE_APP_TH_SOCKET;
    siteId = 'th';
    break;
  case process.env.VUE_APP_DY_HOST:
    baseApi = process.env.VUE_APP_DY_API;
    baseWss = process.env.VUE_APP_DY_SOCKET;
    siteId = 'dy';
    break;
  case process.env.VUE_APP_VNM_HOST:
    baseApi = process.env.VUE_APP_VNM_API;
    baseWss = process.env.VUE_APP_VNM_SOCKET;
    siteId = 'vnm';
    break;
  case process.env.VUE_APP_KAKA_HOST:
    baseApi = process.env.VUE_APP_KAKA_API;
    baseWss = process.env.VUE_APP_KAKA_SOCKET;
    siteId = 'ka1';
    break;
  case process.env.VUE_APP_KRW_HOST:
    baseApi = process.env.VUE_APP_KRW_API;
    baseWss = process.env.VUE_APP_KRW_SOCKET;
    siteId = 'krw';
    break;
  case process.env.VUE_APP_PAK_HOST:
    baseApi = process.env.VUE_APP_PAK_API;
    baseWss = process.env.VUE_APP_PAK_SOCKET;
    siteId = 'pak';
    break;
  default:
    baseApi = process.env.VUE_APP_BASE_API;
    baseWss = process.env.VUE_APP_SOCKET;
    siteId = 'xf';
    break;
}

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

var link = document.querySelector("link[rel~='icon']");
var title = document.querySelector("title");
if (!link) {
  link = document.createElement('link');
  link.rel = 'icon';
  document.head.appendChild(link);
}
if (!title) {
  title = document.createElement('title');
  document.head.appendChild(title);
}
if (siteId === 'dy') {
  link.href = '/dy-favicon.ico';
  title.innerText = '东赢后台';
} else if (siteId === 'xf') {
  link.href = '/xf-favicon.ico';
  title.innerText = '兴发后台';
} else if (siteId === 'th') {
  link.href = '/th-favicon.ico';
  title.innerText = 'Jolly88';
} else if (siteId === 'ind') {
  link.href = '/ind-favicon.ico';
  title.innerText = '55Ace';
} else if (siteId === 'lh') {
  link.href = '/favicon.ico';
  title.innerText = '雷火后台';
} else if (siteId === 'vnm') {
  link.href = '/favicon.ico';
  title.innerText = 'TF88';
} else if (siteId === 'ka1') {
  link.href = '/kaka-favicon.ico';
  title.innerText = 'KAKA LIVE';
} else if (siteId === 'krw') {
  link.href = '/kr-favicon.ico';
  title.innerText = 'City8';
} else if (siteId === 'iw2') {
  link.href = '/iw2-favicon.ico';
  title.innerText = '789F';
} else {
  link.href = '/favicon.ico';
  title.innerText = 'TF88';
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
