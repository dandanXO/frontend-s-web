import { Platform } from "quasar";
import moment from "moment/moment";

export const MAIN = "MAIN";

export const getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
export const getMobileOS = () => {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) {
    return "ANDROID";
  } else if (/iPad|iPhone|iPod/.test(ua)) {
    return "IOS";
  }
  return null;
};
export const getDevice = () => {
  return isMobile() ? "MOBILE" : "WEB";
};

export function isEmpty(obj) {
  if (typeof obj == "undefined" || obj == null || obj == "") {
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

export function isAndroid() {
  if (Platform.is.android && Platform.is.capacitor) {
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

export const updateDate = (val) => {
  const gapDate = new Date().getTime() - val * 24 * 60 * 60 * 1000;
  const oldDate = new Date(gapDate);

  // Adjust the time to GMT+7.0
  oldDate.setHours(oldDate.getHours() + 7);
  oldDate.setMinutes(oldDate.getMinutes() + 0);

  const newDate = {
    Y: oldDate.getFullYear() + "-",
    M: oldDate.getMonth() + 1 < 10 ? "0" + (oldDate.getMonth() + 1 + "-") : oldDate.getMonth() + 1 + "-",
    D: oldDate.getDate() < 10 ? "0" + (oldDate.getDate() + "") : oldDate.getDate() + ""
  };
  return newDate.Y + newDate.M + newDate.D;
};

export const convertToGMT55 = (dateTime) => {
  return moment(dateTime).utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
};
export const convertToGMT8 = (dateTime) => {
  return moment(dateTime).utcOffset("+08:00").format("YYYY-MM-DD");
};
export const convertToGMT7 = (dateTime) => {
  return moment(dateTime).utcOffset("+07:00").format("YYYY-MM-DD");
};

export const convertToCommaAmount = (amount, isForceDecimal) => {
  if (amount === null) {
    return 0;
  }
  if (isNonNumericString(amount)) {
    return amount;
  }

  const truncatedAmount = isForceDecimal ? amount : Math.trunc(amount);

  return Number(truncatedAmount).toLocaleString("en-US", {
    minimumFractionDigits: isForceDecimal ? 2 : 0,
    maximumFractionDigits: isForceDecimal ? 2 : 0
  });
};

export const displayPlatform = (platform) => {
  if (platform === "BTI") {
    return "55Ace";
  }
  return platform;
};

function isNonNumericString(value) {
  return typeof value === "string" && isNaN(value);
}

export const isInPwa = () => {
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const hasRbKey = Object.keys(localStorage).some((key) => key.startsWith("__rb_"));
  const hasPwa = sessionStorage.getItem("IS_PWA");
  return isStandalone || hasRbKey || hasPwa;
};
