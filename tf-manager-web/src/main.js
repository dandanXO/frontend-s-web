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

var imageCDNUrl = process.env.VUE_APP_IMAGE;

console.log(currentHost);
// currentHost = "ka1-manager.wermop342ox.com";
switch (currentHost) {
  case process.env.VUE_APP_IW2_HOST:
    baseApi = process.env.VUE_APP_BASE_API;
    baseWss = process.env.VUE_APP_SOCKET;
    siteId = 'iw2';
    break;
  case process.env.VUE_APP_IND_HOST:
    baseApi = process.env.VUE_APP_BASE_API;
    baseWss = process.env.VUE_APP_SOCKET;
    siteId = 'ind';
    break;
  case process.env.VUE_APP_LH_HOST:
    baseApi = process.env.VUE_APP_BASE_API;
    baseWss = process.env.VUE_APP_SOCKET;
    siteId = 'lh';
    break;
  case process.env.VUE_APP_TH_HOST:
    baseApi = process.env.VUE_APP_BASE_API;
    baseWss = process.env.VUE_APP_SOCKET;
    siteId = 'th';
    break;
  case process.env.VUE_APP_DY_HOST:
    baseApi = process.env.VUE_APP_BASE_API;
    baseWss = process.env.VUE_APP_SOCKET;
    siteId = 'dy';
    break;
  case process.env.VUE_APP_VNM_HOST:
    baseApi = process.env.VUE_APP_BASE_API;
    baseWss = process.env.VUE_APP_SOCKET;
    siteId = 'vnm';
    break;
  case process.env.VUE_APP_KAKA_HOST:
    baseApi = process.env.VUE_APP_BASE_API;
    baseWss = process.env.VUE_APP_SOCKET;
    siteId = 'ka1';
    break;
  case process.env.VUE_APP_KRW_HOST:
    baseApi = process.env.VUE_APP_BASE_API;
    baseWss = process.env.VUE_APP_SOCKET;
    siteId = 'krw';
    break;
  case process.env.VUE_APP_PAK_HOST:
    baseApi = process.env.VUE_APP_BASE_API;
    baseWss = process.env.VUE_APP_SOCKET;
    siteId = 'pak';
    break;
  case process.env.VUE_APP_PK2_HOST:
    baseApi = process.env.VUE_APP_BASE_API;
    baseWss = process.env.VUE_APP_SOCKET;
    siteId = 'pk2';
    break;
  case process.env.VUE_APP_BGD_HOST:
    baseApi = process.env.VUE_APP_BASE_API;
    baseWss = process.env.VUE_APP_SOCKET;
    siteId = 'bgd';
    break;
  case process.env.VUE_APP_NGA_HOST:
    baseApi = process.env.VUE_APP_BASE_API;
    baseWss = process.env.VUE_APP_SOCKET;
    siteId = 'nga';
    break;
  case process.env.VUE_APP_PH1_HOST:
    baseApi = process.env.VUE_APP_BASE_API;
    baseWss = process.env.VUE_APP_SOCKET;
    siteId = 'ph1';
    break;
  case process.env.VUE_APP_TH2_HOST:
    baseApi = process.env.VUE_APP_BASE_API;
    baseWss = process.env.VUE_APP_SOCKET;
    siteId = 'th2';
    break;
  case process.env.VUE_APP_PK3_HOST:
    baseApi = process.env.VUE_APP_BASE_API;
    baseWss = process.env.VUE_APP_SOCKET;
    siteId = 'pk3';
    break;
  case process.env.VUE_APP_AU1_HOST:
    baseApi = process.env.VUE_APP_BASE_API;
    baseWss = process.env.VUE_APP_SOCKET;
    siteId = 'au1';
    break;
  case process.env.VUE_APP_BR1_HOST:
    baseApi = process.env.VUE_APP_BR1_API;
    baseWss = process.env.VUE_APP_BR1_SOCKET;
    imageCDNUrl = process.env.VUE_APP_BR1_IMAGE;
    siteId = 'br1';
    break;
  case process.env.VUE_APP_BR2_HOST:
    baseApi = process.env.VUE_APP_BR1_API;
    baseWss = process.env.VUE_APP_BR1_SOCKET;
    imageCDNUrl = process.env.VUE_APP_BR1_IMAGE;
    siteId = 'br2';
    break;
  case process.env.VUE_APP_MX1_HOST:
    baseApi = process.env.VUE_APP_BR1_API;
    baseWss = process.env.VUE_APP_BR1_SOCKET;
    imageCDNUrl = process.env.VUE_APP_BR1_IMAGE;
    siteId = 'mx1';
    break;
  case process.env.VUE_APP_CO1_HOST:
    baseApi = process.env.VUE_APP_BR1_API;
    baseWss = process.env.VUE_APP_BR1_SOCKET;
    imageCDNUrl = process.env.VUE_APP_BR1_IMAGE;
    siteId = 'co1';
    break;
  default:
    baseApi = process.env.VUE_APP_BASE_API;
    baseWss = process.env.VUE_APP_SOCKET;
    siteId = 'xf';
    break;
}

if (currentHost.indexOf(process.env.VUE_APP_KYQ_HOST) > -1) {
  console.log("KYQ")
  baseApi = process.env.VUE_APP_KYQ_API;
  baseWss = process.env.VUE_APP_KYQ_SOCKET;
  imageCDNUrl = process.env.VUE_APP_KYQ_IMAGE;
  siteId = 'lh';
}

if (currentHost.indexOf(process.env.VUE_APP_BFY3_HOST) > -1) {
  console.log("BFY3")
  baseApi = process.env.VUE_APP_BASE_API;
  baseWss = process.env.VUE_APP_SOCKET;
  imageCDNUrl = process.env.VUE_APP_BFY3_IMAGE;
  siteId = 'lh';
}

sessionStorage.setItem("IMAGE_CDN", imageCDNUrl);

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
} else if (siteId === 'ind' || siteId === "au1" || siteId === 'nga' || siteId === 'ph1' || siteId === 'br1' || siteId === 'mx1' || siteId === 'co1' || siteId === 'pk3' || siteId === 'id1' || siteId === 'th2') {
  link.href = '/ind-favicon.ico';
  title.innerText = '55Ace';
} else if (siteId === 'pak' || siteId === 'pk2' || siteId === 'bgd') {
  link.href = '/pak-favicon.ico';
  title.innerText = 'B9Game';
} else if (siteId === 'lh') {
  link.href = '/favicon.ico';
  title.innerText = '雷火后台';
} else if (siteId === 'br2') {
  link.href = '/akb-favicon.ico';
  title.innerText = 'AKB188';
}else if (siteId === 'vnm') {
  link.href = '/favicon.ico';
  title.innerText = 'TF88';
} else if (siteId === 'ka1') {
  link.href = '/kaka-favicon.ico';
  title.innerText = 'KAKA GAME';
} else if (siteId === 'krw') {
  link.href = '/kr-favicon.ico';
  title.innerText = 'DIAMOND';
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
