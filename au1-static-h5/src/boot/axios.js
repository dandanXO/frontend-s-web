import { boot, store } from "quasar/wrappers";
import { createPinia } from "pinia";
import { Loading, Notify, SessionStorage, Dialog } from "quasar";
import { userStore } from "src/stores";
import { ResponseCode } from "../api/response";
import LocalStorage from "boot/local-storage";
import axios from "axios";
import { getRndInteger, isAndroid } from "boot/utils";
import { errorMessages } from "./error-messages";

const rstArray = Object.values(process.env.RST_API);
const evtArray = Object.values(process.env.EVT_API);
const crtArray = Object.values(process.env.CR_API);

var rstApi = getInitApi(rstArray, "AU1_RST_URL");
var crtApi = getInitApi(crtArray, "AU1_CRT_URL");
var evtApi = getInitApi(evtArray, "AU1_EVT_URL");

const api = axios.create({ baseURL: rstApi });
const cashier = axios.create({ baseURL: crtApi });
const eventapi = axios.create({ baseURL: evtApi });

let isRefreshing = false;

const refreshWitheList = ["/member/token/refresh"];

const finishRefreshEvent = new CustomEvent("finishRefresh");

const getCurrentAxiosInstance = (config) => {
  switch (config.baseURL) {
    case rstApi:
      return api;
    case crtApi:
      return cashier;
    case evtApi:
      return eventapi;
    default:
      return axios;
  }
};

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

  const onRequest = async (config) => {
    if (isRefreshing && !refreshWitheList.includes(config.url)) {
      const retry = await new Promise((resolve) => {
        const handleRefreshEnd = () => {
          config.headers.token = store.token;
          document.removeEventListener("finishRefresh", handleRefreshEnd);
          resolve(config);
        };

        document.addEventListener("finishRefresh", handleRefreshEnd);
      });
      return retry;
    }

    let token;
    if (isAndroid()) {
      token = LocalStorage.getItem("TOKEN");
    } else {
      token = SessionStorage.getItem("TOKEN");
    }

    if (token || store.token) {
      config.headers.token = token || store.token;
      //   api.defaults.headers["token"] = store.token;
      //   cashier.defaults.headers["token"] = store.token;
      //   eventapi.defaults.headers["token"] = store.token;
    }
    // config.headers["Authorization"] = process.env.SITE;

    // if (config.data) {
    //   config.data = config.data;
    // }
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
    const originalRequest = errorresp.config;
    const originalInstance = getCurrentAxiosInstance(originalRequest);

    attemptTimes++;
    if (isRefreshing) {
      const res = await originalInstance(originalRequest);
      return res.data;
    }
    Notify.create({
      spinner: true,
      type: "warning",
      timeout: 1000,
      position: "top",
      message: "Refreshing..."
    });
    isRefreshing = true;

    const res = await api.post("/member/token/refresh");
    // console.log(res);
    SessionStorage.set("TOKEN", res.data);
    LocalStorage.set("TOKEN", res.data);
    store.token = res.data;
    originalRequest.headers.token = store.token;

    isRefreshing = false;
    document.dispatchEvent(finishRefreshEvent);
    const newRes = await axios(originalRequest);
    attemptTimes = 0;

    return newRes.data;
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
      const messageTranslated = errorMessages[res.code] || "Error";

      if (res.code === ResponseCode.ERROR_SYSTEM || res.code === ResponseCode.PROMOID_NOT_FOUND) {
        return res;
      }
      if (res.code === ResponseCode.TOO_OFTEN_REQUEST || res.code === ResponseCode.ERROR_AMOUNT_DEPOSIT) {
        return res;
      }
      if (res.code === ResponseCode.OTP_COOLDOWN_ERROR) {
        return res;
      }
      if (res.code === ResponseCode.EMPTY_PROMO_POPOUT) {
        return res;
      }
      if (res.code === ResponseCode.ERROR_GUEST_LOGGED) {
        return res;
      }
      if (res.code === ResponseCode.ERROR_UNAUTHORIZED || res.code === ResponseCode.ERROR_TOKEN_REVOKED) {
        SessionStorage.remove("TOKEN");
        LocalStorage.remove("TOKEN");
        router.push("/login");
        location.reload();
        return;
      } else {
        if (
          res.code === ResponseCode.ERROR_NAME_EXIST ||
          res.code === ResponseCode.ERROR_TOKEN_LOGGED ||
          res.code === ResponseCode.ERROR_TOKEN_EXPIRED
        ) {
          // debugger;
          if (attemptTimes > 10) {
            SessionStorage.remove("TOKEN");
            LocalStorage.remove("TOKEN");
            router.push("/login");
            return;
          }
          return refreshTokenAndRetry(response);
        }
        if (res.code === ResponseCode.ERROR_TOKEN_MISSED) {
          if (response.config.url && response.config.url.indexOf("/balance") > -1) {
            return res;
          }
          return Dialog.create({
            class: "login-card",
            title: "Please Login",
            message: "Please log in to operate",
            cancel: { color: "negative", label: "Cancel" },
            ok: { color: "brightbtn", label: "Login" },
            padding: "20px"
          }).onOk(() => {
            router.push("/login");
          });
        }

        Notify.create({
          type: "negative",
          timeout: 1000,
          position: "top",
          message: messageTranslated
        });
      }
      throw new Error(messageTranslated);
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
