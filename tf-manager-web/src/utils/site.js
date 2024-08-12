const XF_SITE_ID = 1;
const THAI_SITE_ID = 3;
const IND_SITE_ID = 5;
const DY_SITE_ID = 6;
const LH_SITE_ID = 7;
const VNM_SITE_ID = 8;
const IND2_SITE_ID = 9;
const KRW_SITE_ID = 10;
const PAK_SITE_ID = 11;
const BGD_SITE_ID = 12;
const NGA_SITE_ID = 14;
const KAKA_SITE_ID = 15;

export const isIndiaSite = (siteId) => {
  return parseInt(siteId) === IND_SITE_ID || parseInt(siteId) === IND2_SITE_ID;
}

export const isCnySite = (siteId) => {
  return parseInt(siteId) === XF_SITE_ID || parseInt(siteId) === DY_SITE_ID || parseInt(siteId) === LH_SITE_ID;
}

export const isVnmSite = (siteId) => {
  return parseInt(siteId) === VNM_SITE_ID || parseInt(siteId) === KAKA_SITE_ID;
}

export function isInd(siteId) {
  return parseInt(siteId) === IND_SITE_ID;
}

export const isInd2 = (siteId) => {
  return parseInt(siteId) === IND2_SITE_ID;
}

export const isPak = (siteId) => {
  return parseInt(siteId) === PAK_SITE_ID;
}

export const isXF = (siteId) => {
  return parseInt(siteId) === XF_SITE_ID;
}

export const isDY = (siteId) => {
  return parseInt(siteId) === DY_SITE_ID;
}

export const isLH = (siteId) => {
  return parseInt(siteId) === LH_SITE_ID;
}

export const isThai = (siteId) => {
  return parseInt(siteId) === THAI_SITE_ID;
}

export const isKorea = (siteId) => {
  return parseInt(siteId) === KRW_SITE_ID;
}

export const isVnm = (siteId) => {
  return parseInt(siteId) === VNM_SITE_ID;
}

export const isBgd = (siteId) => {
  return parseInt(siteId) === BGD_SITE_ID;
}

export const isNga = (siteId) => {
  return parseInt(siteId) === NGA_SITE_ID;
}

export const isKaka = (siteId) => {
  return parseInt(siteId) === KAKA_SITE_ID;
}
