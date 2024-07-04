import axios from "axios";
import { getRndInteger } from "@/utils/utils";
import { ElMessage } from "element-plus";
import { stringify } from "qs";
import { userStore } from "@/store";
import i18n from "../i18n/index";
import { ResponseCode, SkipErrorCode } from "@/api/response";

const rstArray = process.env.VUE_APP_RST_API.split(",");
const evtArray = process.env.VUE_APP_EVT_API.split(",");
const crArray = process.env.VUE_APP_CR_API.split(",");

const globalLinks= ["tf88won"];
console.log(window.location.hostname);
const isGlobalVN = globalLinks.some(link => window.location.hostname.includes(link));

const q7yxLinks= ["q7yxpdxwxk"];
const isq7yxVN = q7yxLinks.some(link => window.location.hostname.includes(link));

if(isGlobalVN){
  var rstGlobalArray = process.env.VUE_APP_GLOBAL_RST_API.split(",");
  var evtGlobalArray = process.env.VUE_APP_GLOBAL_EVT_API.split(",");
  var crGlobalArray = process.env.VUE_APP_GLOBAL_CR_API.split(",");

  var rstApi = getInitApi(rstGlobalArray, "VNM_WEB_RST_URL");
  var evtApi = getInitApi(evtGlobalArray, "VNM_WEB_EVT_URL");
  var crtApi = getInitApi(crGlobalArray, "VNM_WEB_CRT_URL");

  localStorage.setItem("IMAGE_CDN", process.env.VUE_APP_GLOBAL_IMAGE_CDN);

}else if(isq7yxVN){
  var rstArray2 = process.env.VUE_APP_Q7YX_RST_API.split(",");
  var evtArray2 = process.env.VUE_APP_Q7YX_EVT_API.split(",");
  var crArray2 = process.env.VUE_APP_Q7YX_CR_API.split(",");

  var rstApi = getInitApi(rstArray2, "VNM_WEB_RST_URL");
  var evtApi = getInitApi(evtArray2, "VNM_WEB_EVT_URL");
  var crtApi = getInitApi(crArray2, "VNM_WEB_CRT_URL");

}else{
  var rstApi = getInitApi(rstArray, "VNM_WEB_RST_URL");
  var crtApi = getInitApi(crArray, "VNM_WEB_CRT_URL");
  var evtApi = getInitApi(evtArray, "VNM_WEB_EVT_URL");
}


function getInitApi(apiLinks, urlLsName) {
  var successRstUrl = localStorage.getItem(urlLsName);
  if (successRstUrl) {
    axios.get(successRstUrl + "/ping").then((res) => {
      // console.log(res);
      if (res.status !== 200) {
        localStorage.removeItem(urlLsName);
      }
    }).catch((err) => {
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
      res.message = i18n.global.t('response.' + res.code) || res.message
      return res;
    }

    if (res.code === ResponseCode.ERROR_UNAUTHORIZED) {
      store.token = null;
      location.reload();
    } else {
      if (res.code === ResponseCode.ERROR_TOKEN_EXPIRED ||
        res.code === ResponseCode.ERROR_TOKEN_MISSED ||
        res.code === ResponseCode.ERROR_NAME_EXIST
      ) {
        store.token = null;
        if (window.location.pathname === '/promotion') {
          res.message = i18n.global.t('response.' + res.code) || res.message
          return res;
        } else {
          location.reload();
        }
      }
      if (res.code === ResponseCode.ERROR_TOKEN_LOGGED) {
        store.token = null;
        location.reload();
      }
      // if (res.code === 36001 || 36002 || 36003 || 36004 || 36005 || 36006 || 36007 || 36008 || 36009) {
      //   // 龙卡
      //   return res
      // }
      // message.error(res.message, 4);
      // ElMessage.error(res.message);

    }
    // throw new Error(res.message || "Error");
    res.message = i18n.global.t('response.' + res.code) || res.message
    return res
  } else {
    return response.data;
  }
};

const onResponseError = (error) => {
  // message.error(error.message);
  ElMessage({
    message: i18n.global.t('response.' + error.code) || error.message,
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
