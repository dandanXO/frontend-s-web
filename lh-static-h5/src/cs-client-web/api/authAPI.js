/* eslint-disable */
import { csapi, csws } from "boot/axios";
import qs from "qs";
import isNull from "lodash/isNull";
import isEmpty from "lodash/isEmpty";
import LocalStorage from "src/cs-client-web/utils/local-storage";

const IS_PROD = process.env.NODE_ENV === "production";

const authAPI = {
  login(
    partnerId,
    way,
    token,
    device = "",
    browser = "",
    referrer_url = "",
    is_new = false,
    partnerCode = "",
    deviceId = ""
  ) {
    let params = {};

    /*
        if ($q.platform.is.android) {
          platform = "ANDROID";
        } else if ($q.platform.is.ios) {
          platform = "IOS";
        }
        */

    params.way = way;
    if (partnerCode) {
      params.partnerCode = partnerCode;
    } else {
      params.partnerId = partnerId;
    }

    if (deviceId != "") {
      params.deviceId = deviceId;
    }

    if (!isNull(token) && !isEmpty(token) && token !== "null") {
      params.token = token;
    }

    params.browser = browser;
    params.device = device;

    // console.log("Ref Url");
    // console.log(referrer_url);
    // console.log(document.referrer);

    params.from = "";
    if (referrer_url != "" && referrer_url != "null" && referrer_url != null) {
      params.from = referrer_url;
    } else if (IS_PROD && document.referrer.indexOf("http://localhost/") > -1) {
      params.from = "App";
    } else if (document.referrer) {
      params.from = document.referrer;
    } else if ((referrer_url == "" && is_new) || referrer_url == "null") {
      params.from = "New Chat";
    }
    if (!is_new && document.referrer) {
      var doc_referrer = document.referrer.split("?")[0];
      LocalStorage.set("referrer", doc_referrer);
    } else if (is_new && referrer_url) {
      referrer_url = referrer_url.split("?")[0];
      LocalStorage.set("referrer", referrer_url);
    }

    // console.log("Login Params");
    // console.log(params);

    return csapi.post("/member/guest/login", qs.stringify(params));
  },
  ping() {
    return csapi.get("/");
  },
  pingCs() {
    return csws.get("/ping");
  }
};

export default authAPI;
