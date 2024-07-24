import { boot, store } from "quasar/wrappers";
import { createPinia } from "pinia";
import { Loading, Notify, SessionStorage, Dialog } from "quasar";
import { ResponseCode } from "../api/response";
import LocalStorage from "boot/local-storage";
import i18n from "../i18n/index";
import axios from "axios";
import { getRndInteger } from "boot/utils";
import { t } from "./lang";

const rstArray = Object.values(process.env.RST_API);
const evtArray = Object.values(process.env.EVT_API);
const crtArray = Object.values(process.env.CR_API);

console.log(window.location.hostname);

var rstApi = getInitApi(rstArray, "KRW_H5_RST_URL");
var crtApi = getInitApi(crtArray, "KRW_H5_CRT_URL");
var evtApi = getInitApi(evtArray, "KRW_H5_EVT_URL");

const api = axios.create({ baseURL: rstApi });
const cashier = axios.create({ baseURL: crtApi });
const eventapi = axios.create({ baseURL: evtApi });

function getInitApi(apiLinks, urlLsName) {
  var successRstUrl = localStorage.getItem(urlLsName);
  if (successRstUrl) {
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
  // console.log(route)
  // const router = useRouter();
  const onResponse = (response) => {
    Loading.show();
    let res = response.data;
    if (typeof response.data === "string") {
      res = JSON.parse(response.data);
    }

    if (res.code !== ResponseCode.SUCCESS) {
      Loading.hide();
      if (res.code === ResponseCode.ERROR_SYSTEM) {
        return res;
      }
      if (res.code === ResponseCode.TOO_OFTEN_REQUEST || res.code === ResponseCode.ERROR_AMOUNT_DEPOSIT) {
        return res;
      }
      if (res.code === ResponseCode.EMPTY_PROMO_POPOUT) {
        return res;
      }
      if(res.code === ResponseCode.ERROR_PROMO_NOT_POUND && response.config.url.indexOf("nextRainTime") > -1){
        return res;
      }
      if (res.code === ResponseCode.ERROR_UNAUTHORIZED) {
        location.reload();
      } else {
        if (
          (window.location.pathname === "/promoapp") &&
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
          if(window.location.pathname !== "/promo")
          {
            return Dialog.create({
              class: "login-card",
              title: t("lang.system_hint"),
              message: t("lang.system_please_login"),
              cancel: { color: "negative", label: t("lang.system_cancel") },
              ok: { color: "brightbtn", label: t("lang.system_loginnow") },
              padding: "20px"
            }).onOk(() => {
              router.push("/login");
            });
          }else{
            return res;
          }
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
        Notify.create({
          type: "negative",
          timeout: 1000,
          position: "top",
          // message: res.message || "错误"
          message:
            i18n.global.t("error." + res.code) + (res.data && res.data.parameter ? res.data.parameter : "") || "Error"
        });
      }
      throw new Error(res.message || "错误");
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
