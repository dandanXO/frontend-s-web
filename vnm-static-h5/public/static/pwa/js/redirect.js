import { PWA_DATA_KEY, domainLists } from "./const.js";

export function getRedirectInfo() {
  const hostname = window.location.hostname.replace("www.", "");
  const origin = window.location.origin;
  const searchParams = new URLSearchParams(window.location.search);
  const savedAffiliateCode = localStorage.getItem("PWA_AFFILIATE_CODE");
  const affiliateCode = searchParams.get("p0") || searchParams.get("id") || savedAffiliateCode || "";
  try {
    const savedRedirectInfo = JSON.parse(localStorage.getItem(PWA_DATA_KEY));
    if (!savedRedirectInfo) throw new Error();
    return savedRedirectInfo;
  } catch (e) {
    return {
      url: `${origin}/agent/${affiliateCode}`
    };
  }
}

export function redirectToGame(fbclid) {
  const redirectInfo = getRedirectInfo();
  console.log(redirectInfo);
  window.location.replace(`${redirectInfo.url}?fbclid=${fbclid}`);
}
