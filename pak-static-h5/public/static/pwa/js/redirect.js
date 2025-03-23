import { PWA_DATA_KEY, domainLists } from "./const.js";

export function getRedirectInfo() {
  const hostname = getDomainWithoutSubdomain();
  const origin = window.location.origin;
  const searchParams = new URLSearchParams(window.location.search);
  const savedAffiliateCode = localStorage.getItem("PWA_AFFILIATE_CODE");
  const affiliateCode = searchParams.get("p0") || searchParams.get("id") || savedAffiliateCode || "4F09FA";
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

function getDomainWithoutSubdomain() {
  let hostname = window.location.hostname;
  let parts = hostname.split(".");

  // 处理 localhost 和 IP
  if (parts.length <= 2 || /^\d+\.\d+\.\d+\.\d+$/.test(hostname) || hostname === "localhost") {
    return hostname; // 直接返回 IP 或 localhost
  }

  return parts.slice(1).join("."); // 去掉第一个 subdomain
}

export function redirectToGame(fbclid) {
  const redirectInfo = getRedirectInfo();
  console.log(redirectInfo);
  window.location.replace(`${redirectInfo.url}?fbclid=${fbclid}`);
}
