import { domainLists, affiliateLists } from "./const.js";

export const getAdjustUrl = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const hostname = window.location.hostname.replace("www.", "");
  const affiliateCodeFromDomain = domainLists[hostname]?.affiliateCode;

  const affidValue = searchParams.get("p0") || searchParams.get("id") || affiliateCodeFromDomain || "";
  const campaignname = searchParams.get("p1") || searchParams.get("campaignname");
  const campaignid = searchParams.get("p2") || searchParams.get("campaignid");
  const adsetname = searchParams.get("p4") || searchParams.get("adsetname");
  const adsetid = searchParams.get("p3") || searchParams.get("adsetid");
  const adname = searchParams.get("p5") || searchParams.get("adname");
  const adid = searchParams.get("p6") || searchParams.get("adid");
  const fbclid = searchParams.get("fbclid");
  const date = Date.now();
  const adjustUrlCode = affiliateLists[affidValue]["adCode"];
  const apiUrl = `${window.location.origin}/blank.html`;

  return `https://app.adjust.com/${adjustUrlCode}?campaign=${campaignname}%20%28${campaignid}%29&adgroup=${adsetname}%20%28${adsetid}%29&creative=${adname}%20%28${adid}%29&fbclid=${fbclid}&redirect=${apiUrl}?v=${date}`;
};
