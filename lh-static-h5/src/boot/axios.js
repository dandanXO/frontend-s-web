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
  "lh988."
];
const isGlobalLH = globalLinks.some((link) => window.location.hostname.includes(link));

const globalAndCNLinks = ["leihuo", "e693.cc", "e890.cc", "e561.cc", "e396.cc"];
const isGlobalAndCN = globalAndCNLinks.some((link) => window.location.hostname.includes(link));

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
if (isGlobalLH) {
  console.log("Is Global");

  var rstApi = "https://aptvpnubglgl.conoibue6er.com";
  var evtApi = "https://przl4oufglgl.anpoxuaq9ae.com";
  var crtApi = "https://caxlzwt2glgl.inc8ozys5we.com";

  localStorage.setItem("LH_H5_RST_URL", rstApi);
  localStorage.setItem("LH_H5_EVT_URL", evtApi);
  localStorage.setItem("LH_H5_CRT_URL", crtApi);
} else if (isGlobalAndCN) {
  console.log("IS Global + CN");
  var rstGlobalArray = Object.values(process.env.GLOBAL_RST_API);
  var evtGlobalArray = Object.values(process.env.GLOBAL_EVT_API);
  var crGlobalArray = Object.values(process.env.GLOBAL_CR_API);

  var rstApi = getInitApi(rstGlobalArray, "LH_H5_RST_URL");
  var evtApi = getInitApi(evtGlobalArray, "LH_H5_EVT_URL");
  var crtApi = getInitApi(crGlobalArray, "LH_H5_CRT_URL");
} else {
  var rstApi = getInitApi(rstArray, "LH_H5_RST_URL");
  var evtApi = getInitApi(evtArray, "LH_H5_EVT_URL");
  var crtApi = getInitApi(crtArray, "LH_H5_CRT_URL");
}

const api = axios.create({ baseURL: rstApi });
const cashier = axios.create({ baseURL: crtApi });
const eventapi = axios.create({ baseURL: evtApi });

function getInitApi(apiLinks, urlLsName) {
  var successRstUrl = localStorage.getItem(urlLsName);
  if (successRstUrl) {
    if (isInApp()) {
      return successRstUrl;
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

function getErrorType(errorUrl) {
  errorUrl = errorUrl.replace("https://", "");
  const firstStr = errorUrl.substr(0, 5);
  console.log(firstStr);

  return firstStr;
}

function isInApp() {
  if (
    window.location.pathname === "/vip" ||
    window.location.pathname === "/viptest" ||
    window.location.pathname === "/promotion" ||
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

    if (window.location.pathname === "/deposittest" || window.location.pathname === "/viptest") {
      console.log(config.baseURL + config.url);
      alert(config.baseURL + config.url);
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
