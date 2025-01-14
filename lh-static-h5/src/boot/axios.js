import { boot, store } from "quasar/wrappers";
import { createPinia } from "pinia";
import { Loading, SessionStorage, Dialog, Platform } from "quasar";
import { ResponseCode } from "../api/response";
import LocalStorage from "boot/local-storage";
import axios from "axios";
import { getRndInteger } from "boot/utils";
import { useUI } from "src/stores/ui";

const rstArray = Object.values(process.env.RST_API);
const evtArray = Object.values(process.env.EVT_API);
const crtArray = Object.values(process.env.CR_API);
const imgCDN = process.env.IMAGE_CDN;
let apiReplacementRecords = [];

console.log(window.location.hostname);
const globalLinks = [
  "lh050.",
  "lh068.",
  "lh131.",
  "lh165.",
  "lh318.",
  "lh338.",
  "lh360.",
  "lh537.",
  "lh556.",
  "lh730.",
  "lh739.",
  "lh765.",
  "lh768.",
  "lh835.",
  "lh866.",
  "lh869.",
  "lh887.",
  "lh970.",
  "lh971.",
  "lh988.",
  "033lh.vip",
  "lh997.cc",
  "lh135.cc",
  "lh207.cc",
  "lh794.cc",
  "lh595.cc",
  "lh381.cc",
  "lh313.cc",
  "lh693.cc",
  "lh526.cc",
  "lh643.cc",
  "lh311.cc",
  "lh130.cc",
  "lh582.cc",
  "lh982.cc",
  "lh820.cc",
  "lh715.cc",
  "lh571.cc",
  "lh504.cc",
  "lh435.cc",
  "lh575.cc",
  "lh081.cc",
  "lh397.cc",
  "lh408.cc",
  "lh437.cc",
  "lh158.cc",
  "lh225.cc",
  "lh836.cc",
  "lh293.cc",
  "lh259.cc",
  "lh765.cc",
  "lh469.cc",
  "lh418.cc",
  "lh215.cc",
  "lh604.cc",
  "lh496.cc",
  "lh059.cc",
  "lh865.cc",
  "lh911.cc",
  "lh926.cc",
  "lh017.cc",
  "lh070.cc",
  "lh167.cc",
  "lh181.cc",
  "lh350.cc",
  "lh389.cc",
  "lh531.cc",
  "lh579.cc",
  "lh638.cc",
  "lh650.cc",
  "lh717.cc",
  "lh736.cc",
  "lh798.cc",
  "lh819.cc",
  "lh868.cc",
  "lh899.cc",
  "lh939.cc",
  "lh971.cc",
  "lh178.cc"
];
const isGlobalLH = globalLinks.some((link) => window.location.hostname.includes(link));

const globalAndCNLinks = [
  "823223.com",
  "968276.com",
  "385683.com",
  "531950.com",
  "lh684.cc",
  "lh761.cc",
  "lh184.cc",
  "lh434.cc",
  "lh126.cc",
  "lh933.cc",
  "lh920.cc",
  "lh576.cc",
  "lh252.cc",
  "lh800.cc",
  "055267.com",
  "355277.com",
  "858862.com",
  "leihuo",
  "lhgl",
  "e693.cc",
  "e890.cc",
  "e561.cc",
  "e396.cc",
  "lh713.vip",
  "65130.vip",
  "lh049.cc",
  "lh560.cc",
  "lh878.cc",
  "lh202.cc",
  "lh274.cc",
  "lh160.cc",
  "lh096.cc",
  "lh513.cc",
  "lh558.cc",
  "lh786.cc",
  "lh139.cc",
  "lh255.cc",
  "lh747.cc",
  "lh021.cc",
  "lh217.cc",
  "lh119.cc",
  "lh349.cc",
  "lh477.cc",
  "lh409.cc",
  "lh685.cc",
  "lh726.cc",
  "lh976.cc",
  "lh875.cc",
  "lh042.cc",
  "lh841.cc",
  "lh922.cc",
  "lh461.cc",
  "lh516.cc",
  "lh961.cc",
  "lh289.cc",
  "lh173.cc",
  "lh317.cc",
  "lh155.cc",
  "lh268.cc",
  "lh407.cc",
  "lh511.cc",
  "lh797.cc",
  "lh657.cc",
  "lh017.cc",
  "lh070.cc",
  "lh096.cc",
  "lh167.cc",
  "lh181.cc",
  "lh350.cc",
  "lh389.cc",
  "lh531.cc",
  "lh579.cc",
  "lh638.cc",
  "lh650.cc",
  "lh717.cc",
  "lh736.cc",
  "lh798.cc",
  "lh819.cc",
  "lh868.cc",
  "lh899.cc",
  "lh939.cc",
  "lh971.cc",
  "lh178.cc",
  "lh015.cc",
  "lh051.cc",
  "lh076.cc",
  "lh080.cc",
  "lh169.cc",
  "lh171.cc",
  "lh197.cc",
  "lh316.cc",
  "lh378.cc",
  "lh536.cc",
  "lh578.cc",
  "lh586.cc",
  "lh616.cc",
  "lh656.cc",
  "lh710.cc",
  "lh756.cc",
  "lh771.cc",
  "lh791.cc",
  "lh815.cc",
  "lh850.cc",
  "lh880.cc",
  "lh906.cc",
  "lh936.cc",
  "lh973.cc",
  "lh993.cc",
  "lh839.cc",
  "lh733.cc",
  "lh705.cc",
  "lh857.cc",
  "lh897.cc",
  "lh307.cc",
  "lh801.cc",
  "lh860.cc",
  "lh563.cc",
  "lh030.cc",
  "lh667.cc",
  "lh373.cc",
  "lh095.cc",
  "lh136.cc",
  "lh518.cc",
  "lh787.cc",
  "lh075.cc",
  "lh960.cc",
  "lh615.cc",
  "lh335.cc",
  "lh731.cc",
  "lh987.cc",
  "lh639.cc",
  "lh681.cc",
  "lh165.cc",
  "lh593.cc",
  "lh937.cc",
  "lh677.cc",
  "lh306.cc",
  "lh175.cc",
  "lh587.cc",
  "lh356.cc",
  "lh118.cc",
  "lh573.cc",
  "lh156.com",
  "lh075.com",
  "lh386.com",
  "lh550.com",
  "pg177.cc",
  "pg663.cc",
  "lh012.cc",
  "lh029.cc",
  "lh032.cc",
  "lh036.cc",
  "lh045.cc",
  "lh108.cc",
  "lh112.cc",
  "lh114.cc",
  "lh122.cc",
  "lh129.cc",
  "lh132.cc",
  "lh134.cc",
  "lh191.cc",
  "lh198.cc",
  "lh208.cc",
  "lh210.cc",
  "lh211.cc",
  "lh261.cc",
  "lh264.cc",
  "lh299.cc",
  "lh303.cc",
  "lh305.cc",
  "lh315.cc",
  "lh324.cc",
  "lh330.cc",
  "lh343.cc",
  "lh351.cc",
  "lh363.cc",
  "lh372.cc",
  "lh374.cc",
  "lh398.cc",
  "lh422.cc",
  "lh428.cc",
  "lh430.cc",
  "lh436.cc",
  "lh456.cc",
  "lh483.cc",
  "lh515.cc",
  "lh519.cc",
  "lh553.cc",
  "lh567.cc",
  "lh569.cc",
  "lh592.cc",
  "lh605.cc",
  "lh645.cc",
  "lh649.cc",
  "lh704.cc",
  "lh709.cc",
  "lh721.cc",
  "lh789.cc",
  "lh792.cc",
  "lh816.cc",
  "lh848.cc",
  "lh861.cc",
  "lh867.cc",
  "lh889.cc",
  "lh908.cc",
  "lh942.cc",
  "lh943.cc",
  "lh953.cc",
  "lh04157.com",
  "lh309.cc",
  "lh279.cc",
  "lh719.cc",
  "lh589.cc",
  "lh969.cc"
];
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

async function init() {
  if (isGlobalLH) {
    console.log("Is Global");

    rstApi = "https://aptvpnubglgl.conoibue6er.com";
    evtApi = "https://przl4oufglgl.anpoxuaq9ae.com";
    crtApi = "https://caxlzwt2glgl.inc8ozys5we.com";

    localStorage.setItem(LH_H5_RST_URL, rstApi);
    localStorage.setItem(LH_H5_EVT_URL, evtApi);
    localStorage.setItem(LH_H5_CRT_URL, crtApi);
  } else if (isGlobalAndCN) {
    console.log("IS Global + CN");
    const rstGlobalArray = Object.values(process.env.GLOBAL_RST_API);
    const evtGlobalArray = Object.values(process.env.GLOBAL_EVT_API);
    const crGlobalArray = Object.values(process.env.GLOBAL_CR_API);

    rstApi = await getInitApi(rstGlobalArray, LH_H5_RST_URL, "1");
    evtApi = await getInitApi(evtGlobalArray, LH_H5_EVT_URL, "2");
    crtApi = await getInitApi(crGlobalArray, LH_H5_CRT_URL, "3");
  } else {
    rstApi = await getInitApi(rstArray, LH_H5_RST_URL, "1");
    evtApi = await getInitApi(evtArray, LH_H5_EVT_URL, "2");
    crtApi = await getInitApi(crtArray, LH_H5_CRT_URL, "3");
  }

  api = axios.create({ baseURL: rstApi });
  cashier = axios.create({ baseURL: crtApi });
  eventapi = axios.create({ baseURL: evtApi });

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
  api.interceptors.request.use(onRequest);
  api.interceptors.response.use(onResponse, onResponseError);
  cashier.interceptors.request.use(onRequest);
  cashier.interceptors.response.use(onResponse, onResponseError);
  eventapi.interceptors.request.use(onRequest);
  eventapi.interceptors.response.use(onResponse, onResponseError);
});

export { axios, api, cashier, eventapi };
