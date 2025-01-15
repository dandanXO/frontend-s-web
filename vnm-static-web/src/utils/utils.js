import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-vue-v3";
import moment from "moment";

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

export const displayBalance = (balance) => {
  let numberItem = balance.toString();

  const numberSplits = numberItem.split(".");
  let numberStr = numberSplits[0];
  let numberDec = numberSplits[1] ?? "";

  // Initialize an empty string to store the formatted number
  let formattedNumber = "";

  // Iterate through the string in reverse order
  for (let i = numberStr.length - 1, j = 0; i >= 0; i--, j++) {
    // Append the character to the formatted number string
    formattedNumber = numberStr[i] + formattedNumber;

    // Add a comma after every third digit, except for the last digit
    if ((j + 1) % 3 === 0 && j !== numberStr.length - 1) {
      formattedNumber = "," + formattedNumber;
    }
  }

  // if(numberDec){
  //   return formattedNumber + "." + numberDec;
  // }
  return formattedNumber;
};

export function isEmpty(obj) {
  if (typeof obj == "undefined" || obj == null || obj == "") {
    return true;
  } else {
    return false;
  }
}

export const isOperaPixelUrl = () => {
  if (
    window.location.href.indexOf("5svn88.com") > -1 ||
    window.location.href.indexOf("tfpromo88.com") > -1 ||
    window.location.href.indexOf("tf88bof.com") > -1 ||
    window.location.href.indexOf("tslotf88.com") > -1 ||
    window.location.href.indexOf("tfnohu18.com") > -1
  ) {
    return true;
  }
  return false;
};

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
    // console.log(timezone);
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

export const toGMT7 = (dateTime, format = "DD/MM/YYYY hh:mm A") => {
  return moment(dateTime).subtract(1, "hours").format(format);
};
