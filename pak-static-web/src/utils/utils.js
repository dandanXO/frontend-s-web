import moment from "moment";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-vue-v3";
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
  } else if (/iPad|iPhone|iPod|Mac OS/.test(ua)) {
    return "IOS";
  }
  return null;
};
export const getDevice = () => {
  return isMobile() ? "MOBILE" : "WEB";
};
export const isEmpty = (value) => {
  if (typeof value == "undefined" || value == null || value == "") {
    return true;
  } else {
    return false;
  }
};
export const convertToCommaAmount = (amount, isForceDecimal) => {
  if (amount === null) {
    return 0;
  }
  if (isNonNumericString(amount)) {
    return amount;
  }
  return parseInt(amount).toLocaleString("en-US", { minimumFractionDigits: isForceDecimal ? 2 : 0 });
};
function isNonNumericString(value) {
  return typeof value === "string" && isNaN(value);
}

export const toGMT5 = (date, format = "YYYY-MM-DD HH:mm:ss") => {
  return moment(date).utcOffset("+05:00").format(format);
};

export const addThousandsComma = (amount, isForceDecimal) => {
  if (amount === null) {
    return 0;
  }
  if (isNonNumericString(amount)) {
    return amount;
  }
  return parseInt(amount).toLocaleString("en-US", { minimumFractionDigits: isForceDecimal ? 2 : 0 });
};

export const getVisitorId = async () => {
  const { getData } = useVisitorData({ extendedResult: true }, { immediate: false });

  const fp = await getData({ ignoreCache: true });

  if (fp?.visitorId) {
    localStorage.setItem("VISITOR_ID", fp.visitorId);
    return fp?.visitorId;
  } else {
    const fpPromise = FingerprintJS.load();
    const fp = await fpPromise;
    const result = await fp.get();
    const { timezone, ...allComponents } = result.components;
    const sidParam = FingerprintJS.hashComponents(allComponents);
    console.log(timezone);
    console.log("Use Normal Fingerprint");
    console.log(sidParam);
    localStorage.setItem("VISITOR_ID", sidParam);
    return sidParam;
  }
};

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
