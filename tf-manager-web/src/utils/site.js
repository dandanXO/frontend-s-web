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
const PH1_SITE_ID = 16;
const ID1_SITE_ID = 17;
const BR1_SITE_ID = 18;
const PAK2_SITE_ID = 19;
const PK3_SITE_ID = 20;
const MX1_SITE_ID = 21;
const CO1_SITE_ID = 22;
const TH2_SITE_ID = 23;
const BPK_SITE_ID = 24;
// const PK4_SITE_ID = 26;
const AU1_SITE_ID = 27;

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
  return parseInt(siteId) === PAK_SITE_ID || parseInt(siteId) === PAK2_SITE_ID || parseInt(siteId) === BGD_SITE_ID || parseInt(siteId) === BPK_SITE_ID;
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

export const isPh1 = (siteId) => {
  return parseInt(siteId) === PH1_SITE_ID;
}

export const isAu1 = (siteId) => {
  return parseInt(siteId) === AU1_SITE_ID;
}

export const isBr1 = (siteId) => {
  return parseInt(siteId) === BR1_SITE_ID;
}

export const isMx1 = (siteId) => {
  return parseInt(siteId) === MX1_SITE_ID;
}

export const isId1 = (siteId) => {
  return parseInt(siteId) === ID1_SITE_ID;
}

export const getSiteTitle = (siteId) => {
  let siteTitle;
  switch (parseInt(siteId)) {
    case XF_SITE_ID :
      siteTitle = "兴发后台 "
      break;
    case THAI_SITE_ID :
      siteTitle = "Jolly88 "
      break;
    case IND_SITE_ID :
      siteTitle = "55Ace "
      break;
    case DY_SITE_ID :
      siteTitle = "东赢后台 "
      break;
    case LH_SITE_ID :
      siteTitle = "雷火后台 "
      break;
    case VNM_SITE_ID :
      siteTitle = "TF88 "
      break;
    case IND2_SITE_ID :
      siteTitle = "789F "
      break;
    case KRW_SITE_ID :
      siteTitle = "DIAMOND "
      break;
    case PAK_SITE_ID :
      siteTitle = "B9.GAME "
      break;
    case BGD_SITE_ID :
      siteTitle = "WIN7.GAME "
      break;
    case NGA_SITE_ID :
      siteTitle = "Nigeria "
      break;
    case KAKA_SITE_ID :
      siteTitle = "KAKA GAME "
      break;
    case PH1_SITE_ID :
      siteTitle = "Philippines "
      break;
    case AU1_SITE_ID :
      siteTitle = "Australia "
      break;
    case ID1_SITE_ID :
      siteTitle = "Indonesia "
      break;
    case BR1_SITE_ID :
      siteTitle = "Brazil "
      break;
    case MX1_SITE_ID :
      siteTitle = "Mexico "
      break;
    case PAK2_SITE_ID :
      siteTitle = "97PKR "
      break;
    case PK3_SITE_ID :
      siteTitle = "Pakistan "
      break;
    case CO1_SITE_ID :
      siteTitle = "Columbia "
      break;
    case TH2_SITE_ID :
      siteTitle = "Thailand "
      break;
    default:
      siteTitle = "后台 "
      break;
  }

  return siteTitle
}
