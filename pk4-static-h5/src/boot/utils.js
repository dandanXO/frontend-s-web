import { Platform } from "quasar";
import moment from "moment/moment";
// import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-vue-v3";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

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

// export const getImageUrl = (srcPath) => require(`/src/assets/${srcPath}`);

export const updateDate = (val) => {
  const gapDate = new Date().getTime() - val * 24 * 60 * 60 * 1000;
  const oldDate = new Date(gapDate);

  // Adjust the time to GMT+5.5
  oldDate.setHours(oldDate.getHours() + 5);
  oldDate.setMinutes(oldDate.getMinutes() + 30);

  const newDate = {
    Y: oldDate.getFullYear() + "-",
    M: oldDate.getMonth() + 1 < 10 ? "0" + (oldDate.getMonth() + 1 + "-") : oldDate.getMonth() + 1 + "-",
    D: oldDate.getDate() < 10 ? "0" + (oldDate.getDate() + "") : oldDate.getDate() + ""
  };
  return newDate.Y + newDate.M + newDate.D;
};

export const convertToGMT55 = (dateTime) => {
  return moment(dateTime).add(-3, "hours").format("YYYY-MM-DD HH:mm:ss");
};
export const convertToGMT8 = (dateTime) => {
  return moment(dateTime).utcOffset("+05:00").format("YYYY-MM-DD");
};
export const normalDateTime = (dateTime) => {
  return moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
};

export const convertToCommaAmount = (amount, isForceDecimal, minimumFractionDigits = 2) => {
  if (amount === null) {
    return 0;
  }
  if (isNonNumericString(amount)) {
    return amount;
  }
  return parseFloat(amount).toLocaleString("en-US", { minimumFractionDigits, maximumFractionDigits: 2 });
};

function isNonNumericString(value) {
  return typeof value === "string" && isNaN(value);
}

export const getVisitorId = async () => {
  // const { getData } = useVisitorData({ extendedResult: true }, { immediate: false });
  //
  // const fp = await getData({ ignoreCache: true });
  //
  // if (fp && fp.visitorId) {
  //   console.log("use Visitor ID");
  //   localStorage.setItem("VISITOR_ID", fp.visitorId);
  //   return fp.visitorId;
  // } else {
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
  // }
};

export const trackNewUserFtd = (e) => {
  const { detail: triggeredPixels } = e;
  if (triggeredPixels.includes("fb")) {
    fbq("trackCustom", "PurchaseComplete");
  }
  if (triggeredPixels.includes("tk")) {
    ttq.track("PurchaseComplete", { content_type: "product" }, { event_id: Date.now() });
  }
  // console.log("PurchaseComplete");

  localStorage.removeItem("newUserFtd");

  document.removeEventListener("ftdPurchaseSuccess", trackNewUserFtd);
  localStorage.removeItem("REG_REFERRAL_CODE");
};

export const isInPwa = () => {
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const hasRbKey = Object.keys(localStorage).some((key) => key.startsWith("__rb_"));
  const hasPwa = sessionStorage.getItem("IS_PWA");
  return isStandalone || hasRbKey || hasPwa;
};

export const generateEventID = () => {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
};
