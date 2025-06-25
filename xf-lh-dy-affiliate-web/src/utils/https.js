import HttpClient from "axios-mapper";
import { ElMessage } from "element-plus";
import { useStore } from "@/store";
import { ResponseCode } from "../api/response";
import { UserActionTypes } from "@/store/modules/user/action-types";
import _cloneDeep from 'lodash/cloneDeep';
import i18n from "../i18n/index";
import router from "../router";

/* eslint-disable */
const toRawType = (value) => {
  return Object.prototype.toString.call(value).slice(8, -1)
}

const clearQueryStr = (param) => {
  return param.split("&").filter(item => item.split("=")[1] !== '').join("&");
}

const clearEmptyParam = (config) => {
  ['data', 'params'].forEach(item => {
    if (config[item]) {
      const rawType = toRawType(config[item])
      if (['Object'].includes(rawType)) {
        const keys = Object.keys(config[item])
        if (keys.length) {
          keys.forEach(key => {
            if (['', undefined, null].includes(config[item][key])) {
              if (['Object'].includes(rawType)) {
                config[item] = _cloneDeep(config[item])
                delete config[item][key]
              }
            }
          })
        }
      } else if (['String'].includes(rawType)) {
        config[item] = clearQueryStr(config[item]);
      }
    }
  })
}
const onRequest = (config) => {
  clearEmptyParam(config);
  return config;
}

const onResponse = (response) => {
  let res = response.data;
  if (typeof response.data === "string") {
    res = JSON.parse(response.data);
  }
  if (res.code !== ResponseCode.SUCCESS) {
    const store = useStore()
    const siteId = store.state.user.siteId
    if(res.code === ResponseCode.ERROR_FORBIDDEN || res.code === ResponseCode.ERROR_FORBIDDEN2){
      if(res.data){
        sessionStorage.setItem('myIPAddress', res.data)
      }
      if(res.ip){
        sessionStorage.setItem('myIPAddress', res.ip)
      }
      if(res.loginName){
        sessionStorage.setItem('myloginName', res.loginName)
      }
      router.push('/403');
      return;
    }
    if (res.code === ResponseCode.ERROR_UNAUTHORIZED) {
      ElMessage({
        message: "Duplicated login.",
        type: "error"
      });
      store.dispatch(UserActionTypes.ACTION_LOGOUT);
      if (siteId === "1" || siteId === 1) {
        router.go("/xf/login")
      } else if (siteId === "3" || siteId === 3) {
        router.go("/th/login")
      } else if (siteId === "5" || siteId === 5) {
        router.go("/ind/login")
      } else if (siteId === "6" || siteId === 6) {
        router.go("/dy/login")
      } else if (siteId === "7" || siteId === 7) {
        router.go("/lh/login")
      } else if (siteId === "8" || siteId === 8) {
        router.go("/vi/login")
      } else if (siteId === "10" || siteId === 10) {
        router.go("/kr/login")
      } else if (siteId === "11" || siteId === 11) {
        router.go("/pak/login")
      }else if (siteId === "15" || siteId === 15) {
        router.go("/kaka/login")
      }else if (siteId === "18" || siteId === 18) {
        router.go("/br1/login")
      }else if (siteId === "28" || siteId === 28) {
        router.go("/br2/login")
      }
      location.reload()
    } else if (res.code === ResponseCode.ERROR_TOKEN_EXPIRED ||
      res.code === ResponseCode.ERROR_TOKEN_MISSED ||
      res.code === ResponseCode.ERROR_TOKEN_INVALID ||
      res.code === ResponseCode.ERROR_TOKEN_LOGGED ||
      res.code === ResponseCode.ERROR_TOKEN_FAILED) {
      ElMessage({
        message: "Please re-login. Code: " + res.code,
        type: "error"
      });
      store.dispatch(UserActionTypes.ACTION_LOGOUT);
      if (siteId === "1" || siteId === 1) {
        router.go("/xf/login")
      } else if (siteId === "3" || siteId === 3) {
        router.go("/th/login")
      } else if (siteId === "5" || siteId === 5) {
        router.go("/ind/login")
      } else if (siteId === "6" || siteId === 6) {
        router.go("/dy/login")
      } else if (siteId === "7" || siteId === 7) {
        router.go("/lh/login")
      } else if (siteId === "8" || siteId === 8) {
        router.go("/vi/login")
      } else if (siteId === "10" || siteId === 10) {
        router.go("/kr/login")
      } else if (siteId === "11" || siteId === 11) {
        router.go("/pak/login")
      }
      location.reload()
    } else {
      // const router = useRouter()
      if (res.code === ResponseCode.ERROR_TOKEN_EXPIRED || res.code === ResponseCode.ERROR_TOKEN_INVALID) {
        store.dispatch(UserActionTypes.ACTION_LOGOUT);
        if (siteId === "1" || siteId === 1) {
          router.go("/xf/login")
        } else if (siteId === "3" || siteId === 3) {
          router.go("/th/login")
        } else if (siteId === "5" || siteId === 5) {
          router.go("/ind/login")
        } else if (siteId === "6" || siteId === 6) {
          router.go("/dy/login")
        } else if (siteId === "7" || siteId === 7) {
          router.go("/lh/login")
        } else if (siteId === "8" || siteId === 8) {
          router.go("/vi/login")
        } else if (siteId === "10" || siteId === 10) {
          router.go("/kr/login")
        } else if (siteId === "11" || siteId === 11) {
          router.go("/pak/login")
        }
        location.reload()
      }
      if (res.code === 11000) {
        ElMessage({
          message: res.message || "Error",
          type: "error"
        });
      } else {
        ElMessage({
          message: i18n.global.t('error.' + res.code) + (res.data && res.data.parameter ? res.data.parameter : "") || "Error",
          type: "error"
        });
      }
    }
    throw new Error(res.message || "Error");
  } else {
    return response;
  }
};

const onResponseError = (error) => {
  ElMessage({
    message: error.message,
    type: "error"
  });
  return Promise.reject(error);
};

const https = (api) => {
  const store = useStore()
  const token = store.state.user.token;
  const currentHost = window.location.host
  // const thaiHost = "affiliate-web.monemental.com"
  // const indHost = "ind-nfaet6t.exerpsison.com"
  // const ind2Host = "iw2-xt5dzo.xlpfl0qqf3p.com"
  // const lhHost = "lh1-affiliate.phoicynxeey.com"
  const lh3Host = "lh1-affiliate.55oq61hr66f.com"
  const lh2Host = "lh1-affiliate.lhf2ifpudro.com"
  const xf1Host = "affiliate-web.gwd4jptunz.com";
  const xf2Host = "xf1-affiliate.gwd4jptunz.com"
  const br2Host = "br2-affiliate.ppk8d1a5rw5.com"
  // const vnmHost = "vnm-affiliate.th80to83w1.com"
  // const krwHost = "krw-affiliate.hiemloelebc.com";
  // const testLocal = "localhost:9998"
  const isAff = api === 'affiliate'
  const isCr = api === 'cashier'
  let apiUrl = process.env.VUE_APP_RST_API;

  console.log(currentHost)
  const isLocalhost = currentHost.indexOf("localhost") > -1 || currentHost.indexOf("127.0.0.1") > -1;
  //Only Global or China.
  if (currentHost.indexOf("-cn") > -1 || currentHost.indexOf(lh2Host) > -1 || currentHost.indexOf(lh3Host) > -1 || currentHost.indexOf(xf1Host) > -1 || currentHost.indexOf(xf2Host) > -1 || isLocalhost) {
    apiUrl = isAff ? process.env.VUE_APP_RST_API : (isCr ? process.env.VUE_APP_CR_API : process.env.VUE_APP_AFF_API)
  } else if (currentHost.indexOf("br2-") > -1 || currentHost.indexOf(br2Host) > -1) {
    apiUrl = isAff ? process.env.VUE_APP_BR2_RST_API : (isCr ? process.env.VUE_APP_BR2_CR_API : process.env.VUE_APP_BR2_AFF_API)
  } else {
    apiUrl = isAff ? process.env.VUE_APP_GLOBAL_RST_API : (isCr ? process.env.VUE_APP_GLOBAL_CR_API : process.env.VUE_APP_GLOBAL_AFF_API)
  }

  const config = {
    baseURL: apiUrl,
    headers: {
      TOKEN: token,
      Authorization: store.state.user.siteCode
    },
    timeout: process.env.TIMEOUT,
  };
  const httpClient = new HttpClient(config);
  httpClient.httpClient.interceptors.request.use(onRequest);
  httpClient.httpClient.interceptors.response.use(onResponse, onResponseError);
  return httpClient;
};

export default https;
