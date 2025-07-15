import { Platform } from "quasar";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-vue-v3";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useNotify } from "src/hooks/notify";
import i18n from "src/i18n";

const { t } = i18n.global;

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

export const getVisitorId = async () => {
  const { getData } = useVisitorData({ extendedResult: true }, { immediate: false });

  const fp = await getData({ ignoreCache: true });

  console.log("VisitorInfo");
  console.log(fp);
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
    console.log("Use Normal Fingerprint");
    console.log(sidParam);
    localStorage.setItem("VISITOR_ID", sidParam);
    return sidParam;
  }
};

export const throttle = (fn, delay = 500) => {
  let timer = null;

  return () => {
    if (timer) return;
    timer = setTimeout(() => {
      fn();
      timer = null;
    }, delay);
  };
};

export const writeClipboard = async (content, useExecCommand = false) => {
  const notify = useNotify();
  try {
    if (window.isSecureContext && navigator.clipboard && !useExecCommand) {
      const permission = await requestClipboardPermission();
      if (permission.state !== "granted") throw new Error();
      await navigator.clipboard.writeText(content);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = content;
      textArea.style.position = "absolute";
      textArea.style.opacity = "0";
      document.body.prepend(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }
    notify({
      type: "success",
      message: t("common.notification.copySuccess.message")
    });
  } catch (error) {
    if (!useExecCommand) {
      await writeClipboard(content, true);
    } else {
      notify({
        type: "error",
        message: t("common.notification.copyError.message")
      });
    }
  }
};
