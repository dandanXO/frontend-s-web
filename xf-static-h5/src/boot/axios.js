import { boot, store } from "quasar/wrappers";
import { createPinia } from "pinia";
import { Loading, Notify, SessionStorage, Dialog } from "quasar";
import { ResponseCode } from "../api/response";
import LocalStorage from "boot/local-storage";
import axios from "axios";
import { getRndInteger } from "boot/utils";

const rstArray = process.env.RST_API;
const crArray = process.env.CR_API;
const evtArray = process.env.EVT_API;
const imgCDN = process.env.IMAGE_CDN;

console.log(window.location.hostname);
const globalLinks = ["xf13140"];
const isGlobalLH = globalLinks.some((link) => window.location.hostname.includes(link));

const globalAndCNLinks = ["xingfabet6", "xingfabet8"];
const isGlobalAndCN = globalAndCNLinks.some((link) => window.location.hostname.includes(link));

const REPLACEMENT_DOMAIN = "random";

if (isGlobalLH) {
  var rstApi = "https://apn0zz6gox.330z3w3.com";
  var evtApi = "https://prx6g60gox.7tk6kax.com";
  var crtApi = "https://cavqhi7gox.ax76c8n.com";

  localStorage.setItem("XF_H5_RST_URL", rstApi);
  localStorage.setItem("XF_H5_EVT_URL", evtApi);
  localStorage.setItem("XF_H5_CRT_URL", crtApi);

  var cdnApi = "https://urle7rqimtl.enkpdmqvhc.com";
  localStorage.setItem("IMAGE_CDN", cdnApi);
} else if (isGlobalAndCN) {
  console.log("IS Global + CN");
  var rstGlobalArray = Object.values(process.env.GLOBAL_RST_API);
  var evtGlobalArray = Object.values(process.env.GLOBAL_EVT_API);
  var crGlobalArray = Object.values(process.env.GLOBAL_CR_API);

  var rstApi = getInitApi(rstGlobalArray, "XF_H5_RST_URL");
  var evtApi = getInitApi(evtGlobalArray, "XF_H5_EVT_URL");
  var crtApi = getInitApi(crGlobalArray, "XF_H5_CRT_URL");
} else {
  var rstApi = getInitApi(rstArray, "XF_H5_RST_URL");
  var crtApi = getInitApi(crArray, "XF_H5_CRT_URL");
  var evtApi = getInitApi(evtArray, "XF_H5_EVT_URL");
}

const api = axios.create({ baseURL: rstApi });
const cashier = axios.create({ baseURL: crtApi });
const eventapi = axios.create({ baseURL: evtApi });

if (imgCDN.indexOf(REPLACEMENT_DOMAIN) > -1) {
  const successImgCdn = localStorage.getItem("IMAGE_CDN");
  if (!successImgCdn) {
    const newDomain = replaceRndDomain("IMAGE_CDN");
    const newImgCDN = imgCDN.replace(REPLACEMENT_DOMAIN, newDomain);
    localStorage.setItem("IMAGE_CDN", newImgCDN);
  }
}


function getInitApi(apiLinks, urlLsName) {
  var successRstUrl = localStorage.getItem(urlLsName);
  if (successRstUrl) {
    axios
      .get(successRstUrl + "/ping")
      .then((res) => {
        console.log(res);
        if (res.status !== 200) {
          localStorage.removeItem(urlLsName);
        }
      })
      .catch((err) => {
        console.log(err);
        localStorage.removeItem(urlLsName);
      });

    return successRstUrl;
  } else {
    if (typeof apiLinks === "string" || apiLinks instanceof String) {
      var initApi = apiLinks;
    } else {
      var apiLists = Object.values(apiLinks);
      var initApi = apiLists[getRndInteger(0, apiLists.length)];
      if (initApi.indexOf(REPLACEMENT_DOMAIN) > -1) {
        const newDomain = replaceRndDomain(urlLsName);
        initApi = initApi.replace(REPLACEMENT_DOMAIN, newDomain);
      }
    }

    axios.get(initApi + "/ping").then((res) => {
      console.log(res);
      if (res.status === 200) {
        localStorage.setItem(urlLsName, initApi);
      } else {
        localStorage.removeItem(urlLsName);
      }
    });
    return initApi;
  }
}

function replaceRndDomain(urlLsName) {
  const rndSecondLevelDomain = generateRndSecondLevelDomain(8);
  const domainPrefix = getApiDomainPrefix(urlLsName);
  return `${domainPrefix}${rndSecondLevelDomain}`;
}

function generateRndSecondLevelDomain(unit) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < unit; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

function getApiDomainPrefix(urlLsName) {
  if (urlLsName.indexOf("RST") > -1) {
    return "ap";
  } else if (urlLsName.indexOf("CR") > -1) {
    return "ca";
  } else if (urlLsName.indexOf("EVT") > -1) {
    return "pr";
  } else if (urlLsName.indexOf("IMAGE_CDN") > -1) {
    return "fi";
  } else {
    return "";
  }
}


export default boot(({ app, router }) => {
  const onRequest = (config) => {
    if (store.token) {
      api.defaults.headers["token"] = store.token;
      cashier.defaults.headers["TOKEN"] = store.token;
      eventapi.defaults.headers["token"] = store.token;
    }
    // config.headers["Authorization"] = process.env.SITE;

    if (config.data) {
      config.data = config.data;
    }
    return config;
  };

  const onResponseError = (error) => {
    // message.error(error.message);
    Notify.create({
      type: "negative",
      timeout: 1000,
      position: "top",
      message: error.message
    });
    Loading.hide();
    return Promise.reject(error);
  };

  // const route = useRoute();
  // const router = useRouter();
  const onResponse = (response) => {
    Loading.show();
    let res = response.data;
    if (typeof response.data === "string") {
      res = JSON.parse(response.data);
    }

    if (res.code !== ResponseCode.SUCCESS) {
      Loading.hide();
      if (res.code === ResponseCode.ERROR_SYSTEM) {
        return res;
      }
      if (res.code === ResponseCode.TOO_OFTEN_REQUEST || res.code === ResponseCode.ERROR_AMOUNT_DEPOSIT) {
        return res;
      }
      if (res.code === ResponseCode.EMPTY_PROMO_POPOUT) {
        return res;
      }
      if (res.code === ResponseCode.ERROR_UNAUTHORIZED) {
        location.reload();
      } else {
        if (
          window.location.pathname === "/promotion" &&
          (res.code === ResponseCode.ERROR_TOKEN_MISSED ||
            res.code === ResponseCode.ERROR_TOKEN_EXPIRED ||
            res.code === ResponseCode.ERROR_TOKEN_LOGGED ||
            res.code === ResponseCode.ERROR_NAME_EXIST)
        ) {
          SessionStorage.remove("TOKEN");
          LocalStorage.remove("TOKEN");
          router.push("/");
          return;
        }

        if (res.code === ResponseCode.ERROR_TOKEN_MISSED) {
          return Dialog.create({
            class: "login-card",
            title: "请登录",
            message: "请登录后操作",
            cancel: { color: "negative", label: "取消" },
            ok: { color: "brightbtn", label: "去登录" },
            padding: "20px"
          }).onOk(() => {
            router.push("/login");
          });
        }
        if (res.code === ResponseCode.ERROR_TOKEN_EXPIRED) {
          SessionStorage.remove("TOKEN");
          LocalStorage.remove("TOKEN");
          window.location.href = "/";
        }
        if (res.code === ResponseCode.ERROR_TOKEN_LOGGED) {
          sessionStorage.setItem("ERROR_TOKEN_LOGGED", "1");
          SessionStorage.remove("TOKEN");
          LocalStorage.remove("TOKEN");
          window.location.href = "/";
        }
        Notify.create({
          type: "negative",
          timeout: 1000,
          position: "top",
          message: res.message || "错误"
        });
      }
      throw new Error(res.message || "错误");
    } else {
      Loading.hide();
      return res;
    }
  };
  app.use(createPinia());
  api.defaults.headers["Authorization"] = process.env.SITE;
  cashier.defaults.headers["Authorization"] = process.env.SITE;
  eventapi.defaults.headers["Authorization"] = process.env.SITE;
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
  app.config.globalProperties.$cashier = cashier;
  app.config.globalProperties.$eventapi = eventapi;
  api.interceptors.request.use(onRequest);
  api.interceptors.response.use(onResponse, onResponseError);
  cashier.interceptors.request.use(onRequest);
  cashier.interceptors.response.use(onResponse, onResponseError);
  eventapi.interceptors.request.use(onRequest);
  eventapi.interceptors.response.use(onResponse, onResponseError);
});

export { axios, api, cashier, eventapi };
