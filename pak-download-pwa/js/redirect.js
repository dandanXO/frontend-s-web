import { PWA_DATA_KEY } from "./const.js";

export const REDIRECT_INFO = {};
export const DEFAULT_REDIRECT_INFO = {
  url: "https://b9game0.com"
};

export function getRedirectInfo() {
  const hostname = window.location.hostname.replace("www.", "");
  try {
    const savedRedirectInfo = JSON.parse(localStorage.getItem(PWA_DATA_KEY));
    if (!savedRedirectInfo) throw new Error();
    return savedRedirectInfo;
  } catch (e) {
    return REDIRECT_INFO[hostname] || DEFAULT_REDIRECT_INFO;
  }
}

export function redirectToGame() {
  const redirectInfo = getRedirectInfo();
  console.log(redirectInfo);
  window.location.replace(redirectInfo.url);
}
