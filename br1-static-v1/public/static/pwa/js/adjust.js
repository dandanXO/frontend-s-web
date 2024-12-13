export const getAdjustUrl = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const affidValue = searchParams.get("p0") || searchParams.get("id") || "6805B0";
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

const affiliateLists = {
  "6805B0": {
    adCode: "1jbcv746"
  },
  "3E5E71": {
    adCode: "1jo14aqf"
  },
  "5DE816": {
    adCode: "1jubhy46"
  },
  "177183": {
    adCode: "1j42dvtz"
  },
  "3A6987": {
    adCode: "1jmuatvy"
  },
  "9E8F63": {
    adCode: "1jaiy8ka"
  },
  "64C9D0": {
    adCode: "1j5oiyte"
  },
  "FA1365": {
    adCode: "1j4ka3qm"
  },
  "FC33FB": {
    adCode: "1jhwqrie"
  },
  "2A7CDB": {
    adCode: "1j281k2x"
  },
  "D3827F": {
    adCode: "1jmlxn4s"
  },
  "9FBFEA": {
    adCode: "1jfbq4li"
  },
  "697F04": {
    adCode: "1jeszen4"
  },
  "AA97F0": {
    adCode: "1japf1ft"
  },
  "DC49A4": {
    adCode: "1j13zm26"
  },
  "53246F": {
    adCode: "1j714ba4"
  },
  "C8B4A4": {
    adCode: "1j3gm5sl"
  },
  "B14C1A": {
    adCode: "1j4o14xq"
  },
  "0D5F18": {
    adCode: "1j6px6oz"
  },
  "E92EF9": {
    adCode: "1j1u1pjq"
  },
  "773A06": {
    adCode: "1jm2f4nf"
  },
};
