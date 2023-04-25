import axios from "axios";
import { getRndInteger } from "@/utils/utils";
import { message } from "ant-design-vue";
import { stringify } from "qs";
import { ResponseCode } from "../api/response";
import { userStore } from "@/store";

const rstArray = process.env.VUE_APP_RST_API.split(",");
const evtArray = process.env.VUE_APP_EVT_API.split(",");
const crArray = process.env.VUE_APP_CR_API.split(",");

const onRequest = (config) => {
  const store = userStore();
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
    if (res.code === ResponseCode.ERROR_AMOUNT_DEPOSIT) {
      return response;
    }
    if (res.code === ResponseCode.ERROR_UNAUTHORIZED) {
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
      message.error(res.message || "Error", 4);
    }
    throw new Error(res.message || "Error");
  } else {
    return response.data;
  }
};
const onResponseError = (error) => {
  message.error(error.message);
  return Promise.reject(error);
};

function initHttp() {
  const host = document.location.host;
  const instance = axios.create({
    timeout: process.env.TIMEOUT,
    headers: {
      domain: host,
    },
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
    CASHIER: null,
  },
  {
    get: (target, propKey) => {
      if (!instance) {
        instance = initHttp();
      }
      if (propKey === "REST") {
        instance.defaults.baseURL = rstArray[getRndInteger(0, rstArray.length)];
      } else if (propKey === "EVENT") {
        instance.defaults.baseURL = evtArray[getRndInteger(0, evtArray.length)];
      } else if (propKey === "CASHIER") {
        instance.defaults.baseURL = crArray[getRndInteger(0, crArray.length)];
      }
      return instance;
    },
  }
);
