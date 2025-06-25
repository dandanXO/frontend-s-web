import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-vue-v3";

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

export const getVisitorId = async () => {
  const { getData } = useVisitorData({ extendedResult: true }, { immediate: false });

  const fp = await getData({ ignoreCache: true });

  // console.log("VisitorInfo");
  // console.log(fp);
  if (fp?.visitorId) {
    localStorage.setItem("VISITOR_ID", fp.visitorId);
    return fp?.visitorId;
  } else {
    const fpPromise = FingerprintJS.load();
    const fp = await fpPromise;
    const result = await fp.get();
    const { timezone, ...allComponents } = result.components;
    // console.log(allComponents);
    const sidParam = FingerprintJS.hashComponents(allComponents);
    console.log(timezone);
    console.log("Use Normal Fingerprint");
    console.log(sidParam);
    localStorage.setItem("VISITOR_ID", sidParam);
    return sidParam;
  }
};
export const convertToCommaAmount = (amount, isForceDecimal) => {
  if (amount === null) {
    return 0;
  }
  if (isNonNumericString(amount)) {
    return amount;
  }

  const formattedAmount = isForceDecimal ? parseFloat(amount).toFixed(2) : parseInt(amount).toLocaleString("en-US");

  return isForceDecimal
    ? parseFloat(formattedAmount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : formattedAmount;
};
function isNonNumericString(value) {
  return typeof value === "string" && isNaN(value);
}
export function getFormattedDateComponents(dateStr) {
  const date = new Date(dateStr);
  const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

  const month = months[date.getMonth()];
  const day = `${date.getDate()}日`;
  const weekday = weekdays[date.getDay()];

  return `${month}${day} ${weekday}`;
}

export const extractVipLevelFromVipStr = (vipStr) => {
  if (!vipStr) return 0;
  const match = vipStr.match(/VIP(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};
