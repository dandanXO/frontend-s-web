import { boot, store } from "quasar/wrappers";
import { createPinia } from "pinia";
import { Loading, SessionStorage, Dialog, Platform } from "quasar";
import { ResponseCode } from "../api/response";
import LocalStorage from "boot/local-storage";
import axios from "axios";
import { getRndInteger } from "boot/utils";
import { useUI } from "src/stores/ui";
import { globalLinks, globalAndCNLinks } from "src/configs/domain";

const rstArray = Object.values(process.env.RST_API);
const evtArray = Object.values(process.env.EVT_API);
const crtArray = Object.values(process.env.CR_API);
const imgCDN = process.env.IMAGE_CDN;
let apiReplacementRecords = [];

console.log(window.location.hostname);

const isGlobalLH = globalLinks.some((link) => window.location.hostname.includes(link));

const isGlobalAndCN = globalAndCNLinks.some((link) => window.location.hostname.includes(link));

const REPLACEMENT_DOMAIN = "random";

const LH_H5_RST_URL = "LH_H5_RST_URL";
const LH_H5_EVT_URL = "LH_H5_EVT_URL";
const LH_H5_CRT_URL = "LH_H5_CRT_URL";

// const specialLinks= ["lh75561","lh77331","lh79669", "lh93371", "lh76390", "lh30553", "lh13179","lh36791", "lh36909", "lh97969", "lh09903", "lh97100", "lh89737", "lh36987", "lh59376", "lh60108", "lh63133", "lh67319", "lh69166"];
// const isSpecialLH = specialLinks.some((link) => window.location.hostname.includes(link));

// if (isSpecialLH){
//   var rstSpecialArray = ["https://apodnbo0tl.anipoius54d.com", "https://ap2gh538tl.se17xiasedy.com"];
//   var evtSpecialArray = ["https://prk46vfitl.111z35h0mt.com", "https://prkuo09ctl.1rqrhcll8p.com"];
//   var crtSpecialArray =["https://cauomdoptl.baw7xptuqr1.com", "https://caaukstntl.ectuu384q0h.com"];
//
//   var rstApi = getInitApi(rstSpecialArray, "LH_H5_RST_URL");
//   var evtApi = getInitApi(evtSpecialArray, "LH_H5_EVT_URL");
//   var crtApi = getInitApi(crtSpecialArray, "LH_H5_CRT_URL");
//
//   var cdnSpecialArray =["https://url9jr173tl.acj39bv80x.com", "https://url847fkttl.b5chotsxy0.com"];
//
//   var cdnApi = cdnSpecialArray[getRndInteger(0, cdnSpecialArray.length)];
//   localStorage.setItem("IMAGE_CDN", cdnApi);
//
// }

let rstApi;
let evtApi;
let crtApi;
let api;
let cashier;
let eventapi;
let csapi;
let csws;

async function init() {
  if (isGlobalLH) {
    console.log("Is Global");

    const rstGlobalArray = process.env.GLOBAL_RST_API.split(",");
    const evtGlobalArray = process.env.GLOBAL_EVT_API.split(",");
    const crGlobalArray = process.env.GLOBAL_CR_API.split(",");

    rstApi = rstGlobalArray[Math.floor(Math.random() * rstGlobalArray.length)];
    evtApi = evtGlobalArray[Math.floor(Math.random() * evtGlobalArray.length)];
    crtApi = crGlobalArray[Math.floor(Math.random() * crGlobalArray.length)];

    localStorage.setItem(LH_H5_RST_URL, rstApi);
    localStorage.setItem(LH_H5_EVT_URL, evtApi);
    localStorage.setItem(LH_H5_CRT_URL, crtApi);
  } else if (isGlobalAndCN) {
    console.log("IS Global + CN");
    const rstGlobalAndCnArray = Object.values(process.env.GLOBAL_AND_CN_RST_API);
    const evtGlobalAndCnArray = Object.values(process.env.GLOBAL_AND_CN_EVT_API);
    const crGlobalAndCnArray = Object.values(process.env.GLOBAL_AND_CN_CR_API);

    rstApi = await getInitApi(rstGlobalAndCnArray, LH_H5_RST_URL, "1");
    evtApi = await getInitApi(evtGlobalAndCnArray, LH_H5_EVT_URL, "2");
    crtApi = await getInitApi(crGlobalAndCnArray, LH_H5_CRT_URL, "3");
  } else {
    rstApi = await getInitApi(rstArray, LH_H5_RST_URL, "1");
    evtApi = await getInitApi(evtArray, LH_H5_EVT_URL, "2");
    crtApi = await getInitApi(crtArray, LH_H5_CRT_URL, "3");
  }

  api = axios.create({ baseURL: rstApi });
  cashier = axios.create({ baseURL: crtApi });
  eventapi = axios.create({ baseURL: evtApi });
  csapi = axios.create({ baseURL: `${rstApi}/cs/api` });
  csws = axios.create({ baseURL: `${rstApi}/cs/ws` });

  if (imgCDN.indexOf(REPLACEMENT_DOMAIN) > -1) {
    const successImgCdn = localStorage.getItem("IMAGE_CDN");
    if (!successImgCdn) {
      const newDomain = replaceRndDomain("IMAGE_CDN");
      const newImgCDN = imgCDN.replace(REPLACEMENT_DOMAIN, newDomain);
      localStorage.setItem("IMAGE_CDN", newImgCDN);
    }
  }
}

// const api = axios.create({ baseURL: rstApi });
// const cashier = axios.create({ baseURL: crtApi });
// const eventapi = axios.create({ baseURL: evtApi });

async function getInitApi(apiLinks, urlLsName, errorPrefix) {
  var successRstUrl = localStorage.getItem(urlLsName);
  if (isInApp()) {
    return await new Promise((resolve) => {
      let APP_INITIAL_TIME_OUT = 5000;
      const checkAppInitialStatus = () => {
        const isAppInitialized = !!sessionStorage.getItem("LH_APP_DOMAIN_INITIALIZED");
        if (isAppInitialized) {
          successRstUrl = localStorage.getItem(urlLsName);
          if (successRstUrl) {
            return "SUCCESS";
          } else {
            return "DOMAIN_NOT_FOUND";
          }
        } else {
          return "FAIL";
        }
      };
      const interval = setInterval(() => {
        const appInitialStatus = checkAppInitialStatus();
        switch (appInitialStatus) {
          case "SUCCESS":
            resolve(successRstUrl);
            clearInterval(interval);
            break;
          case "DOMAIN_NOT_FOUND":
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

            axios.get(initApi + "/ping").then((res) => {
              console.log(res);
              if (res.status === 200) {
                localStorage.setItem(urlLsName, initApi);
              } else {
                localStorage.removeItem(urlLsName);
              }
            });
            resolve(initApi);
            clearInterval(interval);
            break;
          case "FAIL":
            APP_INITIAL_TIME_OUT -= 100;
            if (APP_INITIAL_TIME_OUT <= 0) {
              clearInterval(interval);
              resolve(successRstUrl);
            }
        }
      }, 100);
    });
  } else if (successRstUrl) {
    if (!Object.values(apiLinks).includes(successRstUrl)) {
      apiReplacementRecords.push({ errorPrefix, url: successRstUrl });
    }

    axios
      .get(successRstUrl + "/ping")
      .then((res) => {
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
  return `${rndSecondLevelDomain}`;
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
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isAndroidWebView = /wv/.test(userAgent);
  const isiOSWebView = /WebView/.test(userAgent) && !/Safari/.test(userAgent);
  const isWebView = isAndroidWebView || isiOSWebView;
  if (
    (window.location.pathname === "/vip" ||
      window.location.pathname === "/viptest" ||
      window.location.pathname === "/promotion" ||
      window.location.pathname === "/promotiontest" ||
      window.location.pathname === "/deposit" ||
      window.location.pathname === "/deposittest" ||
      window.location.pathname === "/invitefriend" ||
      window.location.pathname === "/privilege/invite" ||
      window.location.pathname === "/affiliatepage") &&
    isWebView
  ) {
    return true;
  }
  return false;
}

// document.addEventListener(
//   "updateUrlEvent",
//   () => {
//     const RstUrl = localStorage.getItem(LH_H5_RST_URL);
//     const EvtUrl = localStorage.getItem(LH_H5_EVT_URL);
//     const CrtUrl = localStorage.getItem(LH_H5_CRT_URL);

//     api.defaults.baseURL = RstUrl;
//     eventapi.defaults.baseURL = EvtUrl;
//     cashier.defaults.baseURL = CrtUrl;
//   },
//   { once: true }
// );

export default boot(async ({ app, router }) => {
  await init();
  const onRequest = (config) => {
    if (store.token) {
      api.defaults.headers["token"] = store.token;
      cashier.defaults.headers["TOKEN"] = store.token;
      eventapi.defaults.headers["token"] = store.token;
    }
    config.headers["Authorization"] = process.env.SITE;

    if (window.location.pathname === "/deposittest" || window.location.pathname === "/viptest") {
      console.log(config.baseURL + config.url);
      // alert(config.baseURL + config.url);
    }

    if (config.data) {
      config.data = config.data;
    }
    return config;
  };

  const onResponseError = (error) => {
    // message.error(error.message);
    const errorType = getErrorType(error.config.baseURL);

    useUI().notify({
      type: "error",
      timeout: 2500,
      message: error.message + ` (${errorType})`
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

      if (res.code === ResponseCode.ERROR_WITHDRAW_AMOUNT) {
        return res;
      }
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
            window.location.pathname === "/deposit" ||
            window.location.pathname === "/invitefriend" ||
            window.location.pathname === "/vip" ||
            window.location.pathname === "/livestreampage" ||
            window.location.pathname === "/livestreampage/streamplayer" ||
            window.location.pathname === "/privilege/invite") &&
          (res.code === ResponseCode.ERROR_TOKEN_MISSED ||
            res.code === ResponseCode.ERROR_TOKEN_EXPIRED ||
            res.code === ResponseCode.ERROR_TOKEN_LOGGED ||
            res.code === ResponseCode.ERROR_NAME_EXIST)
        ) {
          SessionStorage.remove("TOKEN");
          LocalStorage.remove("TOKEN");
          document.location.href = "app://login";
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
        if (
          res.code === ResponseCode.ERROR_TOKEN_EXPIRED ||
          res.code === ResponseCode.ERROR_NAME_EXIST ||
          res.code === ResponseCode.ERROR_TOKEN_MISSED
        ) {
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

        useUI().notify({
          type: "error",
          timeout: 2500,
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
