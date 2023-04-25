import { boot, store } from "quasar/wrappers";
import { createPinia } from "pinia";
import { Loading, Notify, SessionStorage } from "quasar";
import { ResponseCode } from "../api/response";
import { stringify } from "qs";
import i18n from "../i18n/index";
import axios from "axios";
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
  
  const onResponse = (response) => {
    let res = response.data;
    if (typeof response.data === "string") {
      res = JSON.parse(response.data);
    }
    
    if (res.code !== ResponseCode.SUCCESS) {
      if (res.code === ResponseCode.TOO_OFTEN_REQUEST || res.code === ResponseCode.ERROR_AMOUNT_DEPOSIT) {
        return response;
      }
      if (res.code === ResponseCode.ERROR_UNAUTHORIZED) {
        location.reload();
      } else {
        if (res.code === ResponseCode.ERROR_TOKEN_EXPIRED) {
          SessionStorage.remove("TOKEN");
          // router.push("/")
          window.location.href = "/"
        }
        if (res.code === ResponseCode.ERROR_TOKEN_LOGGED) {
          SessionStorage.remove("TOKEN");
          // router.push("/")
          window.location.href = "/"
        }
        Notify.create({
          type: 'negative',
          timeout: 1000,
          position: 'top',
          message: res.message || "Error"
        })
        Loading.hide()
      }
      throw new Error(res.message || "Error");
    } else {
      return response;
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
