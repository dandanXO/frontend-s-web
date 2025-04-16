import { boot, store } from "quasar/wrappers";
import { createPinia } from "pinia";
import { Loading, Notify, SessionStorage, Dialog } from "quasar";
import { ResponseCode } from "../api/response";
import LocalStorage from "boot/local-storage";
import i18n from "../i18n/index";
import axios from "axios";
import { getRndInteger, isAndroid, isInPwa } from "boot/utils";
import { errorMessages } from "./error-messages";
import { userStore } from "src/stores";

const rstArray = Object.values(process.env.RST_API);
const evtArray = Object.values(process.env.EVT_API);
const crtArray = Object.values(process.env.CR_API);

var rstApi = getInitApi(rstArray, "PK2_RST_URL");
var crtApi = getInitApi(crtArray, "PK2_CRT_URL");
var evtApi = getInitApi(evtArray, "PK2_EVT_URL");

const api = axios.create({ baseURL: rstApi });
const cashier = axios.create({ baseURL: crtApi });
const eventapi = axios.create({ baseURL: evtApi });

function getInitApi(apiLinks, urlLsName) {
  var successRstUrl = sessionStorage.getItem(urlLsName);
  if (successRstUrl) {
    return successRstUrl;
  } else {
    if (typeof apiLinks === "string" || apiLinks instanceof String) {
      var initApi = apiLinks;
    } else {
      var apiLists = Object.values(apiLinks);
      var initApi = apiLists[getRndInteger(0, apiLists.length)];
    }

    sessionStorage.setItem(urlLsName, initApi);
    return initApi;
  }
}

export default boot(({ app, router }) => {
  app.use(createPinia());
  const store = userStore();

  const onRequest = (config) => {
    let token;
    if (isAndroid() || isInPwa() || store.isFromGooglePackage) {
      token = LocalStorage.getItem("TOKEN");
    } else {
      token = SessionStorage.getItem("TOKEN");
    }

    if (token || store.token) {
      config.headers.token = token || store.token;
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

  var attemptTimes = 0;
  async function refreshTokenAndRetry(errorresp) {
    attemptTimes++;
    Notify.create({
      spinner: true,
      type: "warning",
      timeout: 1000,
      position: "top",
      message: "Refreshing..."
    });
    // debugger;
    const originalRequest = errorresp.config;
    console.log(originalRequest);
    const res = await api.post("/member/token/refresh");
    // console.log(res);
    // debugger;
    SessionStorage.set("TOKEN", res.data);
    LocalStorage.set("TOKEN", res.data);
    store.token = res.data;
    originalRequest.headers.token = store.token;

    // originalRequest.headers.TOKEN = store.token;

    return new Promise((resolve, reject) => {
      axios(originalRequest)
        .then((response) => {
          attemptTimes = 0;
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // const route = useRoute();
  // const router = useRouter();
  const onResponse = (response) => {
    // debugger;
    Loading.show();
    let res = response.data;
    if (typeof response.data === "string") {
      res = JSON.parse(response.data);
    }

    if (res.code !== ResponseCode.SUCCESS) {
      Loading.hide();

      if (res.code === ResponseCode.ERROR_NO_PIXEL_CODE) {
        return res;
      }

      if (
        res.code === ResponseCode.ERROR_SYSTEM ||
        res.code === ResponseCode.TOO_OFTEN_REQUEST ||
        res.code === ResponseCode.ERROR_AMOUNT_DEPOSIT ||
        res.code === ResponseCode.EMPTY_PROMO_POPOUT ||
        res.code === ResponseCode.ERROR_PAYMENT_CHANNEL_WRONG ||
        res.code === ResponseCode.ERROR_GUEST_LOGGED ||
        res.code === ResponseCode.ERROR_WITHDRAW_LIMIT_MEMBER ||
        res.code === ResponseCode.ERROR_NO_ELIGIBLE_PLAN_FOUND ||
        res.code === ResponseCode.ERROR_NO_CASH_FLOW
      ) {
        // debugger;
        res.message =
          i18n.global.t("error." + res.code) + (res.data && res.data.parameter ? res.data.parameter : "") || "Error";
        return res;
      }

      if (res.code === ResponseCode.ERROR_UNAUTHORIZED || res.code === ResponseCode.ERROR_TOKEN_REVOKED) {
        SessionStorage.remove("TOKEN");
        LocalStorage.remove("TOKEN");
        if (window.location.pathname === "/promotion") {
          document.location.href = "xfapp:/login";
        } else {
          router.push("/login");
          location.reload();
        }
        return;
      } else {
        if (
          res.code === ResponseCode.ERROR_NAME_EXIST ||
          res.code === ResponseCode.ERROR_TOKEN_LOGGED ||
          res.code === ResponseCode.ERROR_TOKEN_EXPIRED ||
          res.code === ResponseCode.ERROR_TOKEN_INVALID
        ) {
          SessionStorage.remove("TOKEN");
          LocalStorage.remove("TOKEN");

          Notify.create({
            type: "negative",
            timeout: 1000,
            position: "top",
            // message: res.message || "错误"
            message: i18n.global.t("notify.plsLoginToContinue")
          });

          if (window.location.pathname === "/promotion") {
            document.location.href = "xfapp:/login";
          } else {
            store.$reset();
            router.push("/login");
          }

          return;
        }
        // if (res.code === ResponseCode.ERROR_TOKEN_MISSED) {
        //   return Dialog.create({
        //     class: "login-card",
        //     title: "Please Login",
        //     message: "Please log in to operate",
        //     cancel: { color: "negative", label: "Cancel" },
        //     ok: { color: "brightbtn", label: "Login" },
        //     padding: "20px"
        //   }).onOk(() => {
        //     router.push("/login");
        //   });
        // }
        if (
          res.code === ResponseCode.ERROR_TOKEN_EXPIRED ||
          res.code === ResponseCode.ERROR_NAME_EXIST ||
          res.code === ResponseCode.ERROR_TOKEN_MISSED
        ) {
          SessionStorage.remove("TOKEN");
          LocalStorage.remove("TOKEN");
          window.location.href = "/login";
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
      throw new Error(res.message || "Error");
    } else {
      Loading.hide();
      return res;
    }
  };

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
