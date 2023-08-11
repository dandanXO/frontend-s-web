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
const crArray = process.env.VUE_APP_CR_API.split(",");

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

var successfulUrls = [];
let urls = rstArray;
let urlsWithPing = [];
let restInitialized = false;

function placePing(urls) {
  for (const url of urls) {
    urlsWithPing.push(url + "/ping");
  }
}

const testURLs = async (urlsToTest) => {
  for (const url of urlsToTest) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.code === 0) {
          console.log(`Successful URL: ${url}`);
          successfulUrls.push(url.replace("/ping", ""));
        }
      }
    } catch (error) {
      console.log(`Failed URL (error): ${url}`);
    }
  }

  if (successfulUrls.length > 0) {
    const randomIndex = Math.floor(Math.random() * successfulUrls.length);
    const successfulApiUrl = successfulUrls[randomIndex];
    localStorage.setItem("successfulApiUrl", successfulApiUrl);
    console.log(`Random URL stored in local storage: ${successfulApiUrl}`);
  } else {
    console.log("No successful URLs to store.");
  }
};

const apiUrlFunction = () => {
  placePing(urls);
  testURLs(urlsWithPing);
};

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
        if (localStorage.getItem("successfulApiUrl")) {
          instance.defaults.baseURL = localStorage.getItem("successfulApiUrl");
        } else {
          if (!restInitialized) {
            apiUrlFunction();
            window.location.reload;
          }
          restInitialized = true;
          instance.defaults.baseURL =
            rstArray[getRndInteger(0, rstArray.length)];
        }
      } else if (propKey === "EVENT") {
        instance.defaults.baseURL = evtArray[getRndInteger(0, evtArray.length)];
      } else if (propKey === "CASHIER") {
        instance.defaults.baseURL = crArray[getRndInteger(0, crArray.length)];
      }
      return instance;
    }
  }
);
