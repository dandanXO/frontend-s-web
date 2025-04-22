import { domainLists } from "./const.js";

function getDomainWithoutSubdomain() {
  let hostname = window.location.hostname;
  let parts = hostname.split(".");

  // 处理 localhost 和 IP
  if (parts.length <= 2 || /^\d+\.\d+\.\d+\.\d+$/.test(hostname) || hostname === "localhost") {
    return hostname; // 直接返回 IP 或 localhost
  }

  return parts.slice(1).join("."); // 去掉第一个 subdomain
}

export const getAdjustUrl = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const hostname = getDomainWithoutSubdomain();
  // const affiliateCodeFromDomain = domainLists[hostname]?.affiliateCode;
  const adjustUrlCode = domainLists[hostname]?.adCode;

  // const affidValue = searchParams.get("p0") || searchParams.get("id") || affiliateCodeFromDomain || "";
  const campaignname = searchParams.get("p1") || searchParams.get("campaignname") || "{{campaign.name}}";
  const campaignid = searchParams.get("p2") || searchParams.get("campaignid") || "{{campaign.id}}";
  const adsetname = searchParams.get("p4") || searchParams.get("adsetname") || "{{adset.name}}";
  const adsetid = searchParams.get("p3") || searchParams.get("adsetid") || "{{adset.id}}";
  const adname = searchParams.get("p5") || searchParams.get("adname") || "{{ad.name}}";
  const adid = searchParams.get("p6") || searchParams.get("adid") || "{{ad.id}}";
  const fbclid = searchParams.get("fbclid");
  const date = Date.now();
  const apiUrl = encodeURIComponent(`${window.location.origin}/blank.html`);

  return `https://app.adjust.com/${adjustUrlCode}?campaign=${campaignname}%20%28${campaignid}%29&adgroup=${adsetname}%20%28${adsetid}%29&creative=${adname}%20%28${adid}%29&fbclid=${fbclid}&redirect=${apiUrl}?v=${date}`;
};
