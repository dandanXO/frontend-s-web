import { PWA_DATA_KEY } from "./const.js";

export function getRedirectInfo() {
  const hostname = window.location.hostname.replace("www.", "");
  const origin = window.location.origin;
  const searchParams = new URLSearchParams(window.location.search);
  const affiliateCodeFromDomain = domainLists[hostname]?.affiliateCode;
  const affiliateCode = searchParams.get("p0") || searchParams.get("id") || affiliateCodeFromDomain || "6805B0";
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

export function redirectToGame() {
  const redirectInfo = getRedirectInfo();
  console.log(redirectInfo);
  window.location.replace(redirectInfo.url);
}

const domainLists = {
  "6sx65.cc": {
    affiliateCode: "4059DF"
  },
  "dtaw7.cc": {
    affiliateCode: "773A06"
  },
  "5zves.cc": {
    affiliateCode: "E92EF9"
  },
  "g8wwo.cc": {
    affiliateCode: "0D5F18"
  },
  "0zupt.cc": {
    affiliateCode: "B14C1A"
  },
  "cakup.cc": {
    affiliateCode: "C8B4A4"
  },
  "3275x.cc": {
    affiliateCode: "53246F"
  },
  "vjjxe.cc": {
    affiliateCode: "DC49A4"
  },
  "ktmqb.cc": {
    affiliateCode: "AA97F0"
  },
  "lq246.cc": {
    affiliateCode: "697F04"
  },
  "i8seg.cc": {
    affiliateCode: "9FBFEA"
  },
  "z9nsx.cc": {
    affiliateCode: "D3827F"
  },
  "rp864.cc": {
    affiliateCode: "2A7CDB"
  },
  "wypkv.cc": {
    affiliateCode: "FC33FB"
  },
  "phy0n.cc": {
    affiliateCode: "FA1365"
  },
  "8bpi8.cc": {
    affiliateCode: "64C9D0"
  },
  "nk1ta.cc": {
    affiliateCode: "9E8F63"
  },
  "sloju.cc": {
    affiliateCode: "3A6987"
  },
  "9cjxw.cc": {
    affiliateCode: "177183"
  },
  "1mw9q.cc": {
    affiliateCode: "5DE816"
  },
}
