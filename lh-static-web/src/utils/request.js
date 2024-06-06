import axios from "axios";
import { getRndInteger } from "@/utils/utils";
import { ElMessage } from "element-plus";
import { stringify } from "qs";
import { userStore } from "@/store";
// import i18n from "../i18n/index";
import { ResponseCode, SkipErrorCode } from "@/api/response";

const rstArray = process.env.VUE_APP_RST_API.split(",");
const evtArray = process.env.VUE_APP_EVT_API.split(",");
const crArray = process.env.VUE_APP_CR_API.split(",");

console.log(window.location.hostname);
const globalLinks = ["lh318", "lh165", "lh765", "lh730", "lh971", "lh835"];
const isGlobalLH = globalLinks.some((link) => window.location.hostname.includes(link));

const specialLinks= ["lh93371", "lh76390", "lh30553", "lh13179", "lh36909", "lh97969", "lh09903", "lh97100"];
const isSpecialLH = specialLinks.some((link) => window.location.hostname.includes(link));

if (isGlobalLH) {
  var rstApi = "https://aptvpnubglgl.conoibue6er.com";
  var evtApi = "https://przl4oufglgl.anpoxuaq9ae.com";
  var crtApi = "https://caxlzwt2glgl.inc8ozys5we.com";

  localStorage.setItem("LH_WEB_RST_URL", rstApi);
  localStorage.setItem("LH_WEB_EVT_URL",evtApi);
  localStorage.setItem("LH_WEB_CRT_URL",crtApi);

} else if (isSpecialLH){
  var rstSpecialArray = ["https://apodnbo0tl.anipoius54d.com", "https://ap2gh538tl.se17xiasedy.com"];
  var evtSpecialArray = ["https://prk46vfitl.111z35h0mt.com", "https://prkuo09ctl.1rqrhcll8p.com"];
  var crtSpecialArray =["https://cauomdoptl.baw7xptuqr1.com", "https://caaukstntl.ectuu384q0h.com"];

  var rstApi = getInitApi(rstSpecialArray, "LH_WEB_RST_URL");
  var evtApi = getInitApi(evtSpecialArray, "LH_WEB_EVT_URL");
  var crtApi = getInitApi(crtSpecialArray, "LH_WEB_CRT_URL");

  var cdnSpecialArray =["https://url9jr173tl.acj39bv80x.com", "https://url847fkttl.b5chotsxy0.com"];

  var cdnApi = cdnSpecialArray[getRndInteger(0, cdnSpecialArray.length)];
  localStorage.setItem("IMAGE_CDN", cdnApi);

} else if (window.location.hostname.includes("leihuo")) {
  var rstGlobalArray = process.env.VUE_APP_GLOBAL_RST_API.split(",");
  var evtGlobalArray = process.env.VUE_APP_GLOBAL_EVT_API.split(",");
  var crGlobalArray = process.env.VUE_APP_GLOBAL_CR_API.split(",");

  var rstApi = getInitApi(rstGlobalArray, "LH_WEB_RST_URL");
  var evtApi = getInitApi(evtGlobalArray, "LH_WEB_EVT_URL");
  var crtApi = getInitApi(crGlobalArray, "LH_WEB_CRT_URL");
} else {
  var rstApi = getInitApi(rstArray, "LH_WEB_RST_URL");
  var evtApi = getInitApi(evtArray, "LH_WEB_EVT_URL");
  var crtApi = getInitApi(crArray, "LH_WEB_CRT_URL");
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
    var initApi;
    if (typeof apiLinks === "string" || apiLinks instanceof String) {
      initApi = apiLinks;
    } else {
      var apiLists = Object.values(apiLinks);
      initApi = apiLists[getRndInteger(0, apiLists.length)];
    }

    axios.get(initApi + "/ping").then((res) => {
      // console.log(res);
      if (res.status === 200) {
        localStorage.setItem(urlLsName, initApi);
      } else {
        localStorage.removeItem(urlLsName);
      }
    });
    return initApi;
  }
}

const onRequest = (config) => {
  const store = userStore();
  if (store.token) {
    config.headers["TOKEN"] = store.token;
  }
  // console.log(store.token);
  config.headers["Authorization"] = process.env.VUE_APP_SITE;
  if (config.data) {
    config.data = stringify(config.data);
  }
  return config;
};

const onResponse = (response) => {
  let res = response.data;
  if (typeof response.data === "string") {
    res = JSON.parse(response.data);
  }
  // if (res.code !== 0) {
  //   if (
  //     res.code === 601 ||
  //     res.code === 602 ||
  //     res.code === 603 ||
  //     res.code === 604
  //   ) {
  //     const store = userStore();
  //     store.token = null;
  //     // location.reload();
  //   }
  //   throw new Error(res.message || "Error");
  // } else {
  //   return response.data;
  // }
  const store = userStore();

  if (res.code !== ResponseCode.SUCCESS) {
    if (SkipErrorCode(res.code)) {
      return response.data;
    }
    if (res.code === ResponseCode.ERROR_AMOUNT_PRIVILEGE_DEPOSIT) {
      res.message = "优惠存款金额不符合规则";
      return res;
    }
    if (res.code === ResponseCode.ERROR_UNAUTHORIZED) {
      store.token = null;
      location.reload();
    } else {
      if (
        res.code === ResponseCode.ERROR_TOKEN_EXPIRED ||
        res.code === ResponseCode.ERROR_TOKEN_MISSED ||
        res.code === ResponseCode.ERROR_NAME_EXIST
      ) {
        store.token = null;
        location.reload();
      }
      if (res.code === ResponseCode.ERROR_TOKEN_LOGGED) {
        store.token = null;
        location.reload();
      }
      if (res.code === ResponseCode.ERROR_USER_TOO_FAST) {
        ElMessage.error(res.message);
      }
      // if (res.code === 36001 || 36002 || 36003 || 36004 || 36005 || 36006 || 36007 || 36008 || 36009) {
      //   // 龙卡
      //   return res
      // }
      // message.error(res.message, 4);
      // ElMessage.error(res.message);
    }
    // throw new Error(res.message || "Error");
    return res;
  } else {
    return response.data;
  }
};

const onResponseError = (error) => {
  // message.error(error.message);

  ElMessage({
    message: error.message,
    type: "warning"
  });
  return Promise.reject(error);
};

function initHttp() {
  const host = document.location.host;
  const instance = axios.create({
    headers: {
      domain: host
    },
    timeout: process.env.VUE_APP_TIMEOUT
  });
  instance.interceptors.request.use(onRequest);
  instance.interceptors.response.use(onResponse, onResponseError);
  return instance;
}

let instance = null;

export const server = new Proxy(
  {
    REST: null,
    EVENT: null,
    CASHIER: null
  },
  {
    get: (target, propKey) => {
      if (!instance) {
        instance = initHttp();
      }
      if (propKey === "REST") {
        instance.defaults.baseURL = rstApi;
      } else if (propKey === "EVENT") {
        instance.defaults.baseURL = evtApi;
      } else if (propKey === "CASHIER") {
        instance.defaults.baseURL = crtApi;
      }
      return instance;
    }
  }
);
