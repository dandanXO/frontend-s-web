import { Platform } from "quasar";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-vue-v3";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const MAIN = "MAIN";

export const getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
export const isH5 = () => {
  if (
    (Platform.is.ios && "standalone" in window.navigator && window.navigator.standalone) ||
    (Platform.is.android && Platform.is.capacitor)
  ) {
    return true;
  }
  return false;
};
export const isMobile = () => {
  return Platform.is.mobile;
};

export const getDevice = () => {
  if (isH5()) {
    return "H5";
  } else if (isMobile()) {
    return "MOBILE";
  } else {
    return "WEB";
  }
};

export function isAndroid() {
  if (Platform.is.android && Platform.is.capacitor) {
    return true;
  } else {
    return false;
  }
}

export function isHuaweiPhone() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/huawei/i.test(userAgent) && Platform.is.capacitor) {
    return true;
  }

  const huaweiDevicesRegex =
    /ALP-|AMN-|ANA-|ANE-|ANG-|AQM-|ARS-|ART-|ATU-|BAC-|BLA-|BRQ-|CAG-|CAM-|CAN-|CAZ-|CDL-|CDY-|CLT-|CRO-|CUN-|DIG-|DRA-|DUA-|DUB-|DVC-|ELE-|ELS-|EML-|EVA-|EVR-|FIG-|FLA-|FRL-|GLK-|HMA-|HW-|HWI-|INE-|JAT-|JEF-|JER-|JKM-|JNY-|JSC-|LDN-|LIO-|LON-|LUA-|LYA-|LYO-|MAR-|MED-|MHA-|MLA-|MRD-|MYA-|NCE-|NEO-|NOH-|NOP-|OCE-|PAR-|PIC-|POT-|PPA-|PRA-|RNE-|SEA-|SLA-|SNE-|SPN-|STK-|TAH-|TAS-|TET-|TRT-|VCE-|VIE-|VKY-|VNS-|VOG-|VTR-|WAS-|WKG-|WLZ-|JAD-|WKG-|MLD-|RTE-|NAM-|NEN-|BAL-|JAD-|JLN-|YAL/i;

  const isHuaweiDevice = huaweiDevicesRegex.test(navigator.userAgent);
  if (isHuaweiDevice && Platform.is.capacitor) {
    return true;
  }
  return false;
}

export function isEmpty(obj) {
  if (typeof obj == "undefined" || obj == null || obj == "") {
    return true;
  } else {
    return false;
  }
}

export const lsGet = (key, jsonParse = false) => {
  const value = localStorage.getItem(key) ?? "";

  return value && jsonParse ? JSON.parse(value) : value;
};

export const lsStore = (key, value, jsonStringfy = false) => {
  const n_value = jsonStringfy ? JSON.stringify(value) : value;

  localStorage.setItem(key, n_value);
};

export const lsRemove = (key) => localStorage.removeItem(key);

export const getTimeout = (key) => {
  const cached_timeout = lsGet(key) ?? 0;
  const now = new Date();

  return cached_timeout > now.getTime()
    ? Math.ceil((cached_timeout - now.getTime()) / 1000) // Seconds left
    : 0; // No timeout found
};

export const getImageUrl = (srcPath) => require(`/src/assets/${srcPath}`);

export const openLiveChat = (e, router) => {
  e.preventDefault();
  if (location.hostname === "jo77.cc") {
    window.open(
      "https://account.line.biz/login?redirectUri=https%3A%2F%2Fmanager.line.biz%2Finvitation%2FlWIEq8JQyIKPEWGmIxNH8b6P4gAag1",
      "_blank"
    );
  } else {
    router.push("/liveChat");
  }
};

export const getVisitorId = async () => {
  const { getData } = useVisitorData({ extendedResult: true }, { immediate: false });

  const fp = await getData({ ignoreCache: true });

  // console.log("VisitorInfo");
  // console.log(fp);
  if (fp && fp.visitorId) {
    localStorage.setItem("VISITOR_ID", fp.visitorId);
    return fp.visitorId;
  } else {
    const fpPromise = FingerprintJS.load();
    const fp = await fpPromise;
    const result = await fp.get();
    const { timezone, ...allComponents } = result.components;
    // console.log(allComponents);
    const sidParam = FingerprintJS.hashComponents(allComponents);
    console.log("Use Normal Fingerprint");
    console.log(sidParam);
    localStorage.setItem("VISITOR_ID", sidParam);
    return sidParam;
  }
};
