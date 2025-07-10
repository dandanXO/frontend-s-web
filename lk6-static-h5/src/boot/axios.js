import { boot, store } from "quasar/wrappers";
import { createPinia } from "pinia";
import { Loading, Notify, SessionStorage, Dialog } from "quasar";
import { ResponseCode } from "../api/response";
import LocalStorage from "boot/local-storage";
import axios from "axios";
import { getRndInteger } from "boot/utils";
import i18n from "src/i18n";

console.log(window.location.hostname);
const isGlobalDY =
  window.location.hostname.indexOf("dy988.") > -1 ||
  window.location.hostname.indexOf("dy723.") > -1 ||
  window.location.hostname.indexOf("dy639.") > -1;

const { t } = i18n.global;

const globalAndCNLinks = [
  "dy61190.com",
  "dy01065.com",
  "dy044.cc",
  "dy465.cc",
  "dy080.cc",
  "dy798.cc",
  "dy694.cc",
  "dy577.cc",
  "dy542.cc",
  "dy723.cc",
  "dy111.cc",
  "dy602.cc",
  "dongyingbet6",
  "dongyingbet8",
  "dy605.vip",
  "dy595.cc",
  "dy673.cc",
  "dy732.cc",
  "dy568.cc",
  "dy668.cc",
  "dy98038.com"
];
const isGlobalAndCN = globalAndCNLinks.some((link) => window.location.hostname.includes(link));

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
} else if (isGlobalAndCN) {
  console.log("IS Global + CN");
  var rstGlobalArray = Object.values(process.env.GLOBAL_RST_API);
  var evtGlobalArray = Object.values(process.env.GLOBAL_EVT_API);
  var crGlobalArray = Object.values(process.env.GLOBAL_CR_API);

  var rstApi = getInitApi(rstGlobalArray, "DY_H5_RST_URL");
  var evtApi = getInitApi(evtGlobalArray, "DY_H5_EVT_URL");
  var crtApi = getInitApi(crGlobalArray, "DY_H5_CRT_URL");
} else {
  var rstApi = getInitApi(rstArray, "DY_H5_RST_URL", "1");
  var crtApi = getInitApi(crArray, "DY_H5_CRT_URL", "2");
  var evtApi = getInitApi(evtArray, "DY_H5_EVT_URL", "3");
}

const api = axios.create({ baseURL: rstApi });
const cashier = axios.create({ baseURL: crtApi });
const eventapi = axios.create({ baseURL: evtApi });
const csapi = axios.create({ baseURL: `${rstApi}/cs/api` });
const csws = axios.create({ baseURL: `${rstApi}/cs/ws` });

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
      if (res.code === ResponseCode.ERROR_WITHDRAW_AMOUNT) {
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
            title: t("common.notification.loginRequired.title"),
            message: t("common.notification.loginRequired.message"),
            cancel: { color: "negative", label: t("btn.cancel") },
            ok: { color: "brightbtn", label: t("btn.goLogin") },
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
        const translatedMessage = t(`error.${res.code}`);
        Notify.create({
          type: "negative",
          timeout: 1000,
          position: "top",
          message: translatedMessage + ` (${errorType} ${res.code})` || t("common.error")
        });
      }
      const translatedMessage = t(`error.${res.code}`);
      throw new Error(translatedMessage + ` (${errorType} ${res.code})` || t("common.error"));
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
  app.config.globalProperties.$csapi = csapi;
  app.config.globalProperties.$csws = csws;
  api.interceptors.request.use(onRequest);
  api.interceptors.response.use(onResponse, onResponseError);
  cashier.interceptors.request.use(onRequest);
  cashier.interceptors.response.use(onResponse, onResponseError);
  eventapi.interceptors.request.use(onRequest);
  eventapi.interceptors.response.use(onResponse, onResponseError);

  csapi.interceptors.request.use(async (config) => {
    return config;
  });

  csapi.interceptors.response.use(function (response) {
    const code = response.data?.code ?? -1;

    response.data.code = code;
    response.data.success = code === 0;

    return response;
  });
});

export { axios, api, cashier, eventapi, csapi, csws };
