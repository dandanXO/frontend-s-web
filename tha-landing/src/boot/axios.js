import {boot, store} from "quasar/wrappers";
import {createPinia} from "pinia";
import {Loading, Notify, SessionStorage} from "quasar";
import {ResponseCode} from "../api/response";
import {stringify} from "qs";
import i18n from "../i18n/index";
import axios from "axios";
import {getRndInteger} from "boot/utils";


const rstArray = process.env.RST_API;
// const evtArray = process.env.EVT_API;
// const crtArray = process.env.CR_API;

var rstApi = getInitApi(rstArray, "THA_LAND_RST_URL");
// var evtApi = getInitApi(evtArray, "THA_LAND_EVT_URL");
// var crtApi = getInitApi(crtArray, "THA_LAND_CRT_URL");

const api = axios.create({baseURL: rstApi});
// const cashier = axios.create({baseURL: crtApi});
// const eventapi = axios.create({baseURL: evtApi});

function getInitApi(apiLinks, urlLsName) {
    var successRstUrl = localStorage.getItem(urlLsName);
    if (successRstUrl) {
        axios.get(successRstUrl + "/ping").then((res) => {
            // console.log(res);
            if (res.status !== 200) {
                localStorage.removeItem(urlLsName);
            }
        }).catch((err) => {
            // console.log(err);
            localStorage.removeItem(urlLsName);
        })

        return successRstUrl;
    } else {
        if (typeof apiLinks === 'string' || apiLinks instanceof String) {
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
        })
        return initApi;
    }
}


export default boot(({app, router}) => {
    const onRequest = (config) => {
        if (store.token) {
            api.defaults.headers["token"] = store.token;
            // cashier.defaults.headers["TOKEN"] = store.token
            // eventapi.defaults.headers["token"] = store.token
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
                    message: i18n.global.t('error.' + res.code) + (res.data && res.data.parameter ? res.data.parameter : "") || "Error"
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
    // cashier.defaults.headers["Authorization"] = process.env.SITE;
    // eventapi.defaults.headers["Authorization"] = process.env.SITE;
    app.config.globalProperties.$axios = axios;
    app.config.globalProperties.$api = api;
    // app.config.globalProperties.$cashier = cashier;
    // app.config.globalProperties.$eventapi = eventapi;
    api.interceptors.request.use(onRequest);
    api.interceptors.response.use(onResponse, onResponseError);
    // cashier.interceptors.request.use(onRequest);
    // cashier.interceptors.response.use(onResponse, onResponseError);
    // eventapi.interceptors.request.use(onRequest);
    // eventapi.interceptors.response.use(onResponse, onResponseError);

});

export {axios, api};
