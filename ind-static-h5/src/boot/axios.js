import {boot, store} from "quasar/wrappers";
import {createPinia} from "pinia";
import {Loading, Notify, SessionStorage, Dialog} from "quasar";
import {ResponseCode} from "../api/response";
import LocalStorage from "boot/local-storage"
import axios from "axios";
import {getRndInteger} from "boot/utils";

const rstArray = Object.values(process.env.RST_API);
const evtArray = Object.values(process.env.EVT_API);
const crtArray = Object.values(process.env.CR_API);

var rstApi = getRstApi();
var crtApi = getCrtApi();
var evtApi = getEvtApi();

const api = axios.create({baseURL: rstApi});
const cashier = axios.create({baseURL: crtApi});
const eventapi = axios.create({baseURL: evtApi});

function getCrtApi() {
    var successCrtUrl = localStorage.getItem("successCrtUrl");
    if (successCrtUrl) {

        axios.get(successCrtUrl+ "/ping").then((res) => {
            console.log(res);
            if (res.status !== 200) {
                localStorage.removeItem("successCrtUrl");
            }
        }).catch((err) => {
            console.log(err);
            localStorage.removeItem("successCrtUrl");
        })

        return successCrtUrl;
    } else {
        var crtTestApi = crtArray[getRndInteger(0, crtArray.length)];

        axios.get(crtTestApi+ "/ping").then((res) => {
            console.log(res);
            if (res.status === 200) {
                localStorage.setItem("successCrtUrl", crtTestApi);
            } else {
                localStorage.removeItem("successCrtUrl");
            }
        })

        return crtTestApi;
    }
}

function getEvtApi() {
    var successEvtUrl = localStorage.getItem("successEvtUrl");
    if (successEvtUrl) {

        axios.get(successEvtUrl + "/ping").then((res) => {
            console.log(res);
            if (res.status !== 200) {
                localStorage.removeItem("successEvtUrl");
            }
        }).catch((err) => {
            console.log(err);
            localStorage.removeItem("successEvtUrl");
        })

        return successEvtUrl;
    } else {
        var testEvtApi = evtArray[getRndInteger(0, evtArray.length)];

        axios.get(testEvtApi + "/ping").then((res) => {
            console.log(res);
            if (res.status === 200) {
                localStorage.setItem("successEvtUrl", testEvtApi);
            } else {
                localStorage.removeItem("successEvtUrl");
            }
        })

        return testEvtApi;
    }
}

function getRstApi() {
    var successRstUrl = localStorage.getItem("successRstUrl");
    if (successRstUrl) {

        axios.get(successRstUrl + "/ping").then((res) => {
            console.log(res);
            if (res.status !== 200) {
                localStorage.removeItem("successRstUrl");
            }
        }).catch((err) => {
            console.log(err);
            localStorage.removeItem("successRstUrl");
        })

        return successRstUrl;
    } else {
        var testApi = rstArray[getRndInteger(0, rstArray.length)];

        axios.get(testApi + "/ping").then((res) => {
            console.log(res);
            if (res.status === 200) {
                localStorage.setItem("successRstUrl", testApi);
            } else {
                localStorage.removeItem("successRstUrl");
            }
        })

        return testApi;
    }
}

export default boot(({app, router}) => {
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
            if (res.code === ResponseCode.EMPTY_PROMO_POPOUT) {
                return res;
            }
            if (res.code === ResponseCode.ERROR_UNAUTHORIZED) {
                location.reload();
            } else {
                if (res.code === ResponseCode.ERROR_TOKEN_MISSED) {
                    return Dialog.create({
                        class: "login-card",
                        title: 'Please Login',
                        message: "Please log in to operate",
                        cancel: {color: "negative", label: "Cancel"},
                        ok: {color: "brightbtn", label: "Login"},
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
    app.config.globalProperties.$eventapi = eventapi;
    api.interceptors.request.use(onRequest);
    api.interceptors.response.use(onResponse, onResponseError);
    cashier.interceptors.request.use(onRequest);
    cashier.interceptors.response.use(onResponse, onResponseError);
    eventapi.interceptors.request.use(onRequest);
    eventapi.interceptors.response.use(onResponse, onResponseError);

});

export {axios, api, cashier, eventapi};
