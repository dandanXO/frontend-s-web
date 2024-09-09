import { boot, store } from "quasar/wrappers";
import { createPinia } from "pinia";
import { Loading, Notify, SessionStorage, Dialog } from "quasar";
import { ResponseCode } from "../api/response";
import LocalStorage from "boot/local-storage";
import axios from "axios";
import { getRndInteger } from "boot/utils";

console.log(window.location.hostname);
const isGlobalDY = window.location.hostname.indexOf("dy988.") > -1 || window.location.hostname.indexOf("dy723.") > -1;
const imgCDN = process.env.IMAGE_CDN;
let apiReplacementRecords = [];

const rstArray = process.env.RST_API;
const crArray = process.env.CR_API;
const evtArray = process.env.EVT_API;

const REPLACEMENT_DOMAIN = "random";

if (isGlobalDY) {
  var rstApi = "https://apc2ttgdgl.grsib6dfily.com";
  var evtApi = "https://pr5z5egdgl.grsib6dfily.com";
  var crtApi = "https://cad5kegdgl.grsib6dfily.com";
} else {
  var rstApi = getInitApi(rstArray, "DY_H5_RST_URL", "1");
  var crtApi = getInitApi(crArray, "DY_H5_CRT_URL", "2");
  var evtApi = getInitApi(evtArray, "DY_H5_EVT_URL", "3");
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

function getInitApi(apiLinks, urlLsName, errorPrefix) {
  var successRstUrl = localStorage.getItem(urlLsName);
  if (successRstUrl && !isInApp()) {
    if (!Object.values(apiLinks).includes(successRstUrl)) {
      apiReplacementRecords.push({ errorPrefix, url: successRstUrl });
    }

    axios
      .get(successRstUrl + "/ping")
      .then((res) => {
        // console.log(res);
        if (res.status !== 200) {
          localStorage.removeItem(urlLsName);
        }
      })
      .catch((err) => {
        // console.log(err);
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
        apiReplacementRecords.push({ errorPrefix, url: initApi });
      }
    }

    if (isInApp()) {
      localStorage.setItem(urlLsName, initApi);
      return initApi;
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
  const rndSecondLevelDomain = generateRndSecondLevelDomain(10);
  // const domainPrefix = getApiDomainPrefix(urlLsName);
  return rndSecondLevelDomain;
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

// function getApiDomainPrefix(urlLsName) {
//   if (urlLsName.indexOf("RST") > -1) {
//     return "ap";
//   } else if (urlLsName.indexOf("CR") > -1) {
//     return "ca";
//   } else if (urlLsName.indexOf("EVT") > -1) {
//     return "pr";
//   } else if (urlLsName.indexOf("IMAGE_CDN") > -1) {
//     return "fi";
//   } else {
//     return "";
//   }
// }

function getErrorType(errorUrl) {
  const replaceRecord = apiReplacementRecords.find((link) => link.url === errorUrl);

  errorUrl = errorUrl.replace("https://", "");

  if (!replaceRecord) {
    const domains = errorUrl.split(".");
    return domains.length > 1 ? domains[1].substr(0, 7) : domains[0].substr(0, 7);
  } else {
    const domains = errorUrl.split(".");
    const subDomainFormErrorUrl = domains[1];
    const prefix = replaceRecord.errorPrefix;
    return `${prefix}.${subDomainFormErrorUrl.substr(0, 6)}`;
  }
}

function isInApp() {
  const hasToken = new URLSearchParams(window.location.search).get("token");
  if (
    (window.location.pathname === "/vip" && hasToken) ||
    window.location.pathname === "/viptest" ||
    (window.location.pathname === "/promotion" && hasToken) ||
    window.location.pathname === "/deposit" ||
    window.location.pathname === "/deposittest" ||
    window.location.pathname === "/invitefriend" ||
    window.location.pathname === "/privilege/invite"
  ) {
    return true;
  }
  return false;
}

export default boot(({ app, router }) => {
  const onRequest = (config) => {
    if (store.token) {
      api.defaults.headers["token"] = store.token;
      cashier.defaults.headers["TOKEN"] = store.token;
      eventapi.defaults.headers["token"] = store.token;
    }
    config.headers["Authorization"] = process.env.SITE;

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
      const errorType = getErrorType(response.config.baseURL);
      if (res.code === ResponseCode.ERROR_SYSTEM) {
        return res;
      }
      if (res.code === ResponseCode.EMPTY_PROMO_POPOUT) {
        return res;
      }
      if (res.code === ResponseCode.ERROR_UNAUTHORIZED) {
        location.reload();
      } else {
        if (
          (window.location.pathname === "/promotion" ||
            window.location.pathname === "/privilege/invite" ||
            window.location.pathname === "/privilege/hongbaoyu" ||
            window.location.pathname === "/deposit" ||
            window.location.pathname === "/invitefriend" ||
            window.location.pathname === "/vip") &&
          (res.code === ResponseCode.ERROR_TOKEN_MISSED ||
            res.code === ResponseCode.ERROR_TOKEN_EXPIRED ||
            res.code === ResponseCode.ERROR_TOKEN_LOGGED ||
            res.code === ResponseCode.ERROR_NAME_EXIST)
        ) {
          SessionStorage.remove("TOKEN");
          LocalStorage.remove("TOKEN");
          document.location.href = "app://login";
        }
        if (res.code === ResponseCode.ERROR_TOKEN_MISSED) {
          return Dialog.create({
            class: "login-card",
            title: "请登录",
            message: "请登录后操作",
            cancel: { color: "negative", label: "取消" },
            ok: { color: "brightbtn", label: "去登陆" },
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
          SessionStorage.remove("TOKEN");
          LocalStorage.remove("TOKEN");
          window.location.href = "/";
        }
        Notify.create({
          type: "negative",
          timeout: 1000,
          position: "top",
          message: res.message + ` (${errorType} ${res.code})` || "错误"
        });
      }
      throw new Error(res.message + ` (${errorType} ${res.code})` || "错误");
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
