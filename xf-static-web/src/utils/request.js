import axios from "axios";
import { getRndInteger } from "@/utils/utils";
import { ElMessage } from "element-plus";
import { stringify } from "qs";
import { userStore } from "@/store";
// import i18n from "../i18n/index";
import { ResponseCode, SkipErrorCode } from "@/api/response";
import { ElLoading } from "element-plus";

const rstArray = process.env.VUE_APP_RST_API.split(",");
const evtArray = process.env.VUE_APP_EVT_API.split(",");
const crtArray = process.env.VUE_APP_CR_API.split(",");

console.log(window.location.hostname);
const globalLinks = ["xf13140"];
const isGlobalLH = globalLinks.some((link) => window.location.hostname.includes(link));

if (isGlobalLH) {
  var rstApi = "https://apn0zz6gox.330z3w3.com";
  var evtApi = "https://prx6g60gox.7tk6kax.com";
  var crtApi = "https://cavqhi7gox.ax76c8n.com";

  localStorage.setItem("XF_WEB_RST_URL", rstApi);
  localStorage.setItem("XF_WEB_EVT_URL", evtApi);
  localStorage.setItem("XF_WEB_CRT_URL", crtApi);

  var imageCdnUrl = "https://urle7rqimtl.enkpdmqvhc.com";
  localStorage.setItem("IMAGE_CDN", imageCdnUrl);
} else {
  var rstApi = getInitApi(rstArray, "XF_WEB_RST_URL");
  var evtApi = getInitApi(evtArray, "XF_WEB_EVT_URL");
  var crtApi = getInitApi(crtArray, "XF_WEB_CRT_URL");
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
  if (store.token) {
    config.headers["TOKEN"] = store.token;
  }
  config.headers["Authorization"] = process.env.VUE_APP_SITE;
  if (config.data) {
    config.data = stringify(config.data);
  }
  return config;
};
const onResponse = (response) => {
  // const loading = ElLoading.service({ lock: true });
  // loading
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
    if (res.code === ResponseCode.EMPTY_PROMO_POPOUT) {
      return response.data;
    }
    if (res.code === ResponseCode.ERROR_UNAUTHORIZED) {
      store.token = null;
      location.reload();
    } else {
      if (res.code === ResponseCode.ERROR_TOKEN_EXPIRED) {
        store.token = null;
        location.reload();
      }
      if (res.code === ResponseCode.ERROR_TOKEN_LOGGED) {
        store.token = null;
        location.reload();
      }
      // message.error(res.message, 4);
      // loading.close();
      ElMessage.error(res.message);
    }
    throw new Error(res.message || "Error");
  } else {
    // loading.close();
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
