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
