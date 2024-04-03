import { boot, store } from "quasar/wrappers";
import { createPinia } from "pinia";
import { Loading, Notify, SessionStorage, Dialog } from "quasar";
import { ResponseCode } from "../api/response";
import LocalStorage from "boot/local-storage";
import axios from "axios";
import { getRndInteger } from "boot/utils";
import { errorMessages } from "./error-messages";

const rstArray = Object.values(process.env.RST_API);
const evtArray = Object.values(process.env.EVT_API);
const crtArray = Object.values(process.env.CR_API);

var rstApi = getInitApi(rstArray, "IND_RST_URL");
var crtApi = getInitApi(crtArray, "IND_CRT_URL");
var evtApi = getInitApi(evtArray, "IND_EVT_URL");

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

export default boot(({ app, router }) => {
  const onRequest = (config) => {
    if (store.token) {
      api.defaults.headers["token"] = store.token;
      cashier.defaults.headers["TOKEN"] = store.token;
      eventapi.defaults.headers["token"] = store.token;
    }
    // config.headers["Authorization"] = process.env.SITE;

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

  async function refreshTokenAndRetry(errorresp) {
    Notify.create({
      spinner: true,
      type: "warning",
      timeout: 1000,
      position: "top",
      message: "Refreshing..."
    });
    // debugger;
    const originalRequest = errorresp.config;
    const res = await api.post("/member/token/refresh");
    // console.log(res);
    SessionStorage.set("TOKEN", res.data);
    LocalStorage.set("TOKEN", res.data);
    store.token = res.data;
    originalRequest.headers.token = store.token;

    return new Promise((resolve, reject) => {
      // 在这里可以修改原始请求的配置，例如添加新的令牌
      // 重新发起请求
      axios(originalRequest)
        .then((response) => {
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
      const messageTranslated = errorMessages[res.code] || "Error";

      if (res.code === ResponseCode.ERROR_SYSTEM) {
        return res;
      }
      if (res.code === ResponseCode.TOO_OFTEN_REQUEST || res.code === ResponseCode.ERROR_AMOUNT_DEPOSIT) {
        return res;
      }
      if (res.code === ResponseCode.EMPTY_PROMO_POPOUT) {
        return res;
      }
      if (res.code === ResponseCode.ERROR_GUEST_LOGGED) {
        return res;
      }
      if (res.code === ResponseCode.ERROR_UNAUTHORIZED) {
        location.reload();
      } else {
        if (
          res.code === ResponseCode.ERROR_NAME_EXIST ||
          res.code === ResponseCode.ERROR_TOKEN_LOGGED ||
          res.code === ResponseCode.ERROR_TOKEN_EXPIRED
        ) {
          // debugger;
          return refreshTokenAndRetry(response);
        }
        if (res.code === ResponseCode.ERROR_TOKEN_MISSED) {
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
