import { PWA_DATA_KEY } from "./const.js";

export function getRedirectInfo() {
  const origin = window.location.origin;
  const searchParams = new URLSearchParams(window.location.search);
  const agent = searchParams.get("p0") || searchParams.get("id") || "6805B0";
  try {
    const savedRedirectInfo = JSON.parse(localStorage.getItem(PWA_DATA_KEY));
    if (!savedRedirectInfo) throw new Error();
    return savedRedirectInfo;
  } catch (e) {
    return {
      url: `${origin}/agent/${agent}`
    };
  }
}

export function redirectToGame() {
  const redirectInfo = getRedirectInfo();
  console.log(redirectInfo);
  window.location.replace(redirectInfo.url);
}
