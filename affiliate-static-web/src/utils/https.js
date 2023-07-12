import HttpClient from "axios-mapper";
import { ElMessage } from "element-plus";
import { useStore } from "@/store";
import { ResponseCode } from "../api/response";
import { UserActionTypes } from "@/store/modules/user/action-types";
import _cloneDeep from 'lodash/cloneDeep';
// import { useRouter } from "vue-router";
import i18n from "../i18n/index";

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
    if (res.code === ResponseCode.ERROR_UNAUTHORIZED) {
      console.log(res, ' there has been an err with the api unauthosized')
      location.reload();
    } else {
      // const router = useRouter()
      if (res.code === ResponseCode.ERROR_TOKEN_EXPIRED || res.code === ResponseCode.ERROR_TOKEN_INVALID) {
        const store = useStore()
        store.dispatch(UserActionTypes.ACTION_LOGOUT);
        location.reload();
      }
      ElMessage({
        message: i18n.global.t('error.' + res.code) + (res.data && res.data.parameter ? res.data.parameter : "") || "Error",
        type: "error"
      });
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

const https = (forAffiliate) => {
  const store = useStore()
  const token = store.state.user.token;
  const isAff = forAffiliate === 'affiliate'
  const config = {
    baseURL: isAff ? process.env.VUE_APP_RST_API : process.env.VUE_APP_BASE_API,
    headers: {
      TOKEN: token
    },
    timeout: process.env.TIMEOUT,
  };
  const httpClient = new HttpClient(config);
  httpClient.httpClient.interceptors.request.use(onRequest);
  httpClient.httpClient.interceptors.response.use(onResponse, onResponseError);
  return httpClient;
};

export default https;
