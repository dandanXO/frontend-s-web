import { boot } from "quasar/wrappers";
import { createPinia, storeToRefs } from "pinia";
import { Loading, Notify, Dialog, Platform } from "quasar";
import { ResponseCode } from "../api/response";
import { userStore } from "src/stores";
import axios from "axios";

let rstApi = getApiDomain("P2W_H5_URL_RST", process.env.RST_API);
let crtApi = getApiDomain("P2W_H5_URL_CRT", process.env.CR_API);
let evtApi = getApiDomain("P2W_H5_URL_EVT", process.env.EVT_API);

const api = axios.create({ baseURL: rstApi });
const cashier = axios.create({ baseURL: crtApi });
const eventapi = axios.create({ baseURL: evtApi });

function getApiDomain(key, testApi) {
  if (!key || !testApi) return null;

  // Get cached or .env domain
  const url = localStorage.getItem(key) ?? testApi;

  // Check if domain works
  axios(url + "/ping", {
    headers: { Authorization: process.env.SITE },
  })
    .then((res) => {
      if (res.status !== 200) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, testApi);
      }
    })
    .catch((_) => localStorage.removeItem(key));

  // Regardless return an endpoint ..
  return url;
}

const keyMap = {
  "/member/register": "regDevice",
  // Else : way
};

export default boot(({ app, router }) => {
  app.use(createPinia());

  const store = userStore();
  const { token } = storeToRefs(store);

  const onRequest = (config) => {
    config.headers["Authorization"] = process.env.SITE;

    if (token.value) config.headers["token"] = token.value;

    if (["post", "put"].includes(config.method)) {
      let way = "H5";

      if ("standalone" in window.navigator && window.navigator.standalone) {
        way = "IOS";
      } else if (Platform.is.capacitor && Platform.is.android) {
        way = "ANDROID";
      }

      const wayKey = keyMap[config.url] ?? "way";

      config.data = `${config.data}&${wayKey}=${way}`;
    }

    return config;
  };

  const onResponseError = (error) => {
    // message.error(error.message);
    Notify.create({
      type: "negative",
      timeout: 1000,
      position: "top",
      message: error.message,
    });
    Loading.hide();
    return Promise.reject(error);
  };

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
      if (
        res.code === ResponseCode.TOO_OFTEN_REQUEST ||
        res.code === ResponseCode.ERROR_AMOUNT_DEPOSIT
      ) {
        return res;
      }
      if (res.code === ResponseCode.EMPTY_PROMO_POPOUT) {
        return res;
      }
      if (res.code === ResponseCode.ERROR_UNAUTHORIZED) {
        location.reload();
      } else {
        if (res.code === ResponseCode.ERROR_TOKEN_MISSED) {
          return Dialog.create({
            class: "login-card",
            title: "请登录",
            message: "请登录后操作",
            cancel: { color: "negative", label: "取消" },
            ok: { color: "brightbtn", label: "去登录" },
            padding: "20px",
          }).onOk(() => {
            router.push("/login");
          });
        }

        if (
          [
            ResponseCode.ERROR_TOKEN_EXPIRED,
            ResponseCode.ERROR_TOKEN_LOGGED,
          ].includes(res.code)
        ) {
          store.memberLogout();
          window.location.href = "/";
        }

        Notify.create({
          type: "negative",
          timeout: 1000,
          position: "top",
          message: res.message || "错误",
        });
      }
      throw new Error(res.message || "错误");
    } else {
      Loading.hide();
      return res;
    }
  };

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
