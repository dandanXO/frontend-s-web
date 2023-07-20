import { boot, store } from "quasar/wrappers";
import { createPinia } from "pinia";
import { Loading, Notify, SessionStorage, Dialog } from "quasar";
import { ResponseCode } from "../api/response";
import LocalStorage from "boot/local-storage"
import axios from "axios";
// import { useRoute, useRouter } from "vue-router";
const crArray = process.env.CR_API;
const api = axios.create({ baseURL: process.env.RST_API });
const cashier = axios.create({ baseURL: crArray });
const eventapi = axios.create({ baseURL: process.env.EVT_API });
export default boot(({ app, router }) => {
  const onRequest = (config) => {
    if (store.token) {
      api.defaults.headers["token"] = store.token;
      cashier.defaults.headers["TOKEN"] = store.token
      eventapi.defaults.headers["token"] = store.token
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
      type: 'negative',
      timeout: 1000,
      position: 'top',
      message: error.message
    })
    Loading.hide()
    return Promise.reject(error);
  };

  // const route = useRoute();
  // const router = useRouter();
  const onResponse = (response) => {
    Loading.show()
    let res = response.data;
    if (typeof response.data === "string") {
      res = JSON.parse(response.data);
    }

    if (res.code !== ResponseCode.SUCCESS) {
      Loading.hide()
      if (res.code === ResponseCode.ERROR_SYSTEM) {
        return res
      }
      if (res.code === ResponseCode.TOO_OFTEN_REQUEST || res.code === ResponseCode.ERROR_AMOUNT_DEPOSIT) {
        return res;
      }
      if (res.code === ResponseCode.ERROR_UNAUTHORIZED) {
        location.reload();
      } else {
        if (res.code === ResponseCode.ERROR_TOKEN_MISSED) {
          return Dialog.create({
            class: "login-card",
            title: '请登录',
            message: "请登录后操作",
            cancel: { color: "negative", label: "取消" },
            ok: { color: "brightbtn", label: "去登录" },
            padding: '20px'
          }).onOk(() => {
            router.push("/login")
          })
        }
        if (res.code === ResponseCode.ERROR_TOKEN_EXPIRED) {
          SessionStorage.remove("TOKEN");
          LocalStorage.remove("TOKEN");
          window.location.href = "/"
        }
        if (res.code === ResponseCode.ERROR_TOKEN_LOGGED) {
          SessionStorage.remove("TOKEN");
          LocalStorage.remove("TOKEN");
          window.location.href = "/";
        }
        Notify.create({
          type: 'negative',
          timeout: 1000,
          position: 'top',
          message: res.message || "错误"
        })
      }
      throw new Error(res.message || "错误");
    } else {
      Loading.hide()
      return res;
    }
  }
  app.use(createPinia());
  api.defaults.headers["Authorization"] = process.env.SITE;
  cashier.defaults.headers["Authorization"] = process.env.SITE;
  eventapi.defaults.headers["Authorization"] = process.env.SITE;
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
  app.config.globalProperties.$cashier = cashier;
  app.config.globalProperties.$eventapi= eventapi;
  api.interceptors.request.use(onRequest);
  api.interceptors.response.use(onResponse, onResponseError);
  cashier.interceptors.request.use(onRequest);
  cashier.interceptors.response.use(onResponse, onResponseError);
  eventapi.interceptors.request.use(onRequest);
  eventapi.interceptors.response.use(onResponse, onResponseError);

});

export { axios, api, cashier, eventapi };
