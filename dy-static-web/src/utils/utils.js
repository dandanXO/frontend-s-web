import { ElMessageBox } from "element-plus";

export const MAIN = "MAIN";

export const getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
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
  const value = localStorage.getItem(key) ?? '';

  return value && jsonParse ? JSON.parse(value) : value;
}

export const lsStore = (key, value, jsonStringfy = false) => {
  const n_value = jsonStringfy ? JSON.stringify(value) : value;

  localStorage.setItem(key, n_value);
}

export const lsRemove = key => localStorage.removeItem(key)

export const getTimeout = key => {
  const cached_timeout = lsGet(key) ?? 0
  const now = new Date()

  return cached_timeout > now.getTime() 
    ? Math.ceil((cached_timeout - now.getTime()) / 1000) // Seconds left
    : 0  // No timeout found
}

export const getImageUrl = srcPath => require(`/src/assets/${srcPath}`)

export const openCommonError = (text = '请登录后再操作') => {
  Swal.fire({
    title: '系统提示',
    text, confirmButtonText: '确认'
  })
}

export const openLoginAlert = store => {
  ElMessageBox.alert("请登录后再操作", "系统提示", {
    // autofocus: false, // if you want to disable its autofocus
    center: true,
    confirmButtonText: "确认",
    showClose: false,
    buttonSize: "large"
  }).then(() => {
    if (store)
      store.loginPageVisible = true
  })
}