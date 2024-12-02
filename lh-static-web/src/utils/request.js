import axios from "axios";
import { getRndInteger } from "@/utils/utils";
import { stringify } from "qs";
import { userStore } from "@/store";
// import i18n from "../i18n/index";
import { ResponseCode, SkipErrorCode } from "@/api/response";
import { uiStore } from "@/store/ui";
import { useRouter } from "vue-router";

const rstArray = process.env.VUE_APP_RST_API.split(",");
const evtArray = process.env.VUE_APP_EVT_API.split(",");
const crArray = process.env.VUE_APP_CR_API.split(",");
const imgCDN = process.env.VUE_APP_IMAGE_CDN;

console.log(window.location.hostname);
const globalLinks = [
  "lh050.",
  "lh068.",
  "lh131.",
  "lh165.",
  "lh318.",
  "lh338.",
  "lh360.",
  "lh537.",
  "lh556.",
  "lh730.",
  "lh739.",
  "lh765.",
  "lh768.",
  "lh835.",
  "lh866.",
  "lh869.",
  "lh887.",
  "lh970.",
  "lh971.",
  "lh988.",
  "033lh.vip",
  "lh997.cc",
  "lh135.cc",
  "lh207.cc",
  "lh794.cc",
  "lh595.cc",
  "lh381.cc",
  "lh313.cc",
  "lh693.cc",
  "lh526.cc",
  "lh643.cc",
  "lh311.cc",
  "lh130.cc",
  "lh582.cc",
  "lh982.cc",
  "lh820.cc",
  "lh715.cc",
  "lh571.cc",
  "lh504.cc",
  "lh435.cc",
  "lh575.cc",
  "lh081.cc",
  "lh397.cc",
  "lh408.cc",
  "lh437.cc",
  "lh158.cc",
  "lh225.cc",
  "lh836.cc",
  "lh293.cc",
  "lh259.cc",
  "lh765.cc",
  "lh469.cc",
  "lh418.cc",
  "lh215.cc",
  "lh604.cc",
  "lh496.cc",
  "lh059.cc",
  "lh865.cc",
  "lh911.cc",
  "lh926.cc",
  "lh017.cc",
  "lh070.cc",
  "lh167.cc",
  "lh181.cc",
  "lh350.cc",
  "lh389.cc",
  "lh531.cc",
  "lh579.cc",
  "lh638.cc",
  "lh650.cc",
  "lh717.cc",
  "lh736.cc",
  "lh798.cc",
  "lh819.cc",
  "lh868.cc",
  "lh899.cc",
  "lh939.cc",
  "lh971.cc",
  "lh178.cc"
];
const isGlobalLH = globalLinks.some((link) => window.location.hostname.includes(link));

const globalAndCNLinks = [
  "055267.com",
  "355277.com",
  "858862.com",
  "leihuo",
  "lhgl",
  "e693.cc",
  "e890.cc",
  "e561.cc",
  "e396.cc",
  "lh713.vip",
  "65130.vip",
  "lh049.cc",
  "lh560.cc",
  "lh878.cc",
  "lh202.cc",
  "lh274.cc",
  "lh160.cc",
  "lh096.cc",
  "lh513.cc",
  "lh558.cc",
  "lh786.cc",
  "lh139.cc",
  "lh255.cc",
  "lh747.cc",
  "lh021.cc",
  "lh217.cc",
  "lh119.cc",
  "lh349.cc",
  "lh477.cc",
  "lh409.cc",
  "lh685.cc",
  "lh726.cc",
  "lh976.cc",
  "lh875.cc",
  "lh042.cc",
  "lh841.cc",
  "lh922.cc",
  "lh461.cc",
  "lh516.cc",
  "lh961.cc",
  "lh289.cc",
  "lh173.cc",
  "lh317.cc",
  "lh155.cc",
  "lh268.cc",
  "lh407.cc",
  "lh511.cc",
  "lh797.cc",
  "lh657.cc",
  "lh017.cc",
  "lh070.cc",
  "lh096.cc",
  "lh167.cc",
  "lh181.cc",
  "lh350.cc",
  "lh389.cc",
  "lh531.cc",
  "lh579.cc",
  "lh638.cc",
  "lh650.cc",
  "lh717.cc",
  "lh736.cc",
  "lh798.cc",
  "lh819.cc",
  "lh868.cc",
  "lh899.cc",
  "lh939.cc",
  "lh971.cc",
  "lh178.cc",
  "lh015.cc",
  "lh051.cc",
  "lh076.cc",
  "lh080.cc",
  "lh169.cc",
  "lh171.cc",
  "lh197.cc",
  "lh316.cc",
  "lh378.cc",
  "lh536.cc",
  "lh578.cc",
  "lh586.cc",
  "lh616.cc",
  "lh656.cc",
  "lh710.cc",
  "lh756.cc",
  "lh771.cc",
  "lh791.cc",
  "lh815.cc",
  "lh850.cc",
  "lh880.cc",
  "lh906.cc",
  "lh936.cc",
  "lh973.cc",
  "lh993.cc",
  "lh839.cc",
  "lh733.cc",
  "lh705.cc",
  "lh857.cc",
  "lh897.cc",
  "lh307.cc",
  "lh801.cc",
  "lh860.cc",
  "lh563.cc",
  "lh030.cc",
  "lh667.cc",
  "lh373.cc",
  "lh095.cc",
  "lh136.cc",
  "lh518.cc",
  "lh787.cc",
  "lh075.cc",
  "lh960.cc",
  "lh615.cc",
  "lh335.cc",
  "lh731.cc",
  "lh987.cc",
  "lh639.cc",
  "lh681.cc",
  "lh165.cc",
  "lh593.cc",
  "lh937.cc",
  "lh677.cc",
  "lh306.cc",
  "lh175.cc",
  "lh587.cc",
  "lh356.cc",
  "lh118.cc",
  "lh573.cc",
  "lh156.com",
  "lh075.com",
  "lh386.com",
  "lh550.com",
  "pg177.cc",
  "pg663.cc",
  "lh012.cc",
  "lh029.cc",
  "lh032.cc",
  "lh036.cc",
  "lh045.cc",
  "lh108.cc",
  "lh112.cc",
  "lh114.cc",
  "lh122.cc",
  "lh129.cc",
  "lh132.cc",
  "lh134.cc",
  "lh191.cc",
  "lh198.cc",
  "lh208.cc",
  "lh210.cc",
  "lh211.cc",
  "lh261.cc",
  "lh264.cc",
  "lh299.cc",
  "lh303.cc",
  "lh305.cc",
  "lh315.cc",
  "lh324.cc",
  "lh330.cc",
  "lh343.cc",
  "lh351.cc",
  "lh363.cc",
  "lh372.cc",
  "lh374.cc",
  "lh398.cc",
  "lh422.cc",
  "lh428.cc",
  "lh430.cc",
  "lh436.cc",
  "lh456.cc",
  "lh483.cc",
  "lh515.cc",
  "lh519.cc",
  "lh553.cc",
  "lh567.cc",
  "lh569.cc",
  "lh592.cc",
  "lh605.cc",
  "lh645.cc",
  "lh649.cc",
  "lh704.cc",
  "lh709.cc",
  "lh721.cc",
  "lh789.cc",
  "lh792.cc",
  "lh816.cc",
  "lh848.cc",
  "lh861.cc",
  "lh867.cc",
  "lh889.cc",
  "lh908.cc",
  "lh942.cc",
  "lh943.cc",
  "lh953.cc"
];
const isGlobalAndCN = globalAndCNLinks.some((link) => window.location.hostname.includes(link));

const REPLACEMENT_DOMAIN = "random";

// const specialLinks= ["lh75561","lh77331","lh79669", "lh93371", "lh76390", "lh30553", "lh13179", "lh36791", "lh36909", "lh97969", "lh09903", "lh97100", "lh89737", "lh36987", "lh59376", "lh60108", "lh63133", "lh67319", "lh69166"];
// const isSpecialLH = specialLinks.some((link) => window.location.hostname.includes(link));

// if (isSpecialLH){
//   var rstSpecialArray = ["https://apodnbo0tl.anipoius54d.com", "https://ap2gh538tl.se17xiasedy.com"];
//   var evtSpecialArray = ["https://prk46vfitl.111z35h0mt.com", "https://prkuo09ctl.1rqrhcll8p.com"];
//   var crtSpecialArray =["https://cauomdoptl.baw7xptuqr1.com", "https://caaukstntl.ectuu384q0h.com"];
//
//   var rstApi = getInitApi(rstSpecialArray, "LH_WEB_RST_URL");
//   var evtApi = getInitApi(evtSpecialArray, "LH_WEB_EVT_URL");
//   var crtApi = getInitApi(crtSpecialArray, "LH_WEB_CRT_URL");
//
//   var cdnSpecialArray =["https://url9jr173tl.acj39bv80x.com", "https://url847fkttl.b5chotsxy0.com"];
//
//   var cdnApi = cdnSpecialArray[getRndInteger(0, cdnSpecialArray.length)];
//   localStorage.setItem("IMAGE_CDN", cdnApi);
//
// }
if (isGlobalLH) {
  console.log("Is Global");

  var rstApi = "https://aptvpnubglgl.conoibue6er.com";
  var evtApi = "https://przl4oufglgl.anpoxuaq9ae.com";
  var crtApi = "https://caxlzwt2glgl.inc8ozys5we.com";

  localStorage.setItem("LH_WEB_RST_URL", rstApi);
  localStorage.setItem("LH_WEB_EVT_URL", evtApi);
  localStorage.setItem("LH_WEB_CRT_URL", crtApi);
} else if (isGlobalAndCN) {
  console.log("IS Global + CN");
  var rstGlobalArray = process.env.VUE_APP_GLOBAL_RST_API.split(",");
  var evtGlobalArray = process.env.VUE_APP_GLOBAL_EVT_API.split(",");
  var crGlobalArray = process.env.VUE_APP_GLOBAL_CR_API.split(",");

  var rstApi = getInitApi(rstGlobalArray, "LH_WEB_RST_URL");
  var evtApi = getInitApi(evtGlobalArray, "LH_WEB_EVT_URL");
  var crtApi = getInitApi(crGlobalArray, "LH_WEB_CRT_URL");
} else {
  var rstApi = getInitApi(rstArray, "LH_WEB_RST_URL");
  var evtApi = getInitApi(evtArray, "LH_WEB_EVT_URL");
  var crtApi = getInitApi(crArray, "LH_WEB_CRT_URL");
}

if (imgCDN.indexOf(REPLACEMENT_DOMAIN) > -1) {
  const successImgCdn = localStorage.getItem("IMAGE_CDN");
  if (!successImgCdn) {
    const newDomain = replaceRndDomain("IMAGE_CDN");
    const newImgCDN = imgCDN.replace(REPLACEMENT_DOMAIN, newDomain);
    localStorage.setItem("IMAGE_CDN", newImgCDN);
  }
}

function getInitApi(apiLinks, urlLsName) {
  var successRstUrl = localStorage.getItem(urlLsName);
  if (successRstUrl) {
    axios
      .get(successRstUrl + "/ping")
      .then((res) => {
        console.log(res);
        if (res.status !== 200) {
          localStorage.removeItem(urlLsName);
        }
      })
      .catch((err) => {
        console.log(err);
        localStorage.removeItem(urlLsName);
      });

    return successRstUrl;
  } else {
    var initApi;
    if (typeof apiLinks === "string" || apiLinks instanceof String) {
      initApi = apiLinks;
    } else {
      var apiLists = Object.values(apiLinks);
      initApi = apiLists[getRndInteger(0, apiLists.length)];
      if (initApi.indexOf(REPLACEMENT_DOMAIN) > -1) {
        const newDomain = replaceRndDomain(urlLsName);
        initApi = initApi.replace(REPLACEMENT_DOMAIN, newDomain);
      }
    }

    axios.get(initApi + "/ping").then((res) => {
      // console.log(res);
      if (res.status === 200) {
        localStorage.setItem(urlLsName, initApi);
      } else {
        localStorage.removeItem(urlLsName);
      }
    });
    return initApi;
  }
}

function replaceRndDomain(urlLsName) {
  const rndSecondLevelDomain = generateRndSecondLevelDomain(10);
  // const domainPrefix = getApiDomainPrefix(urlLsName);
  return `${rndSecondLevelDomain}`;
}

function generateRndSecondLevelDomain(unit) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < unit; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

// function getApiDomainPrefix(urlLsName) {
//   if (urlLsName.indexOf("RST") > -1) {
//     return "ap";
//   } else if (urlLsName.indexOf("CR") > -1) {
//     return "ca";
//   } else if (urlLsName.indexOf("EVT") > -1) {
//     return "pr";
//   } else if (urlLsName.indexOf("IMAGE_CDN") > -1) {
//     return "fi";
//   } else {
//     return "";
//   }
// }

const onRequest = (config) => {
  const store = userStore();
  if (store.token) {
    config.headers["TOKEN"] = store.token;
  }
  // console.log(store.token);
  config.headers["Authorization"] = process.env.VUE_APP_SITE;
  if (config.data) {
    config.data = stringify(config.data);
  }
  return config;
};

const onResponse = (response) => {
  const ui = uiStore();
  let res = response.data;
  if (typeof response.data === "string") {
    res = JSON.parse(response.data);
  }
  // if (res.code !== 0) {
  //   if (
  //     res.code === 601 ||
  //     res.code === 602 ||
  //     res.code === 603 ||
  //     res.code === 604
  //   ) {
  //     const store = userStore();
  //     store.token = null;
  //     // location.reload();
  //   }
  //   throw new Error(res.message || "Error");
  // } else {
  //   return response.data;
  // }
  const store = userStore();

  if (res.code !== ResponseCode.SUCCESS) {
    if (SkipErrorCode(res.code)) {
      return response.data;
    }
    if (res.code === ResponseCode.ERROR_AMOUNT_PRIVILEGE_DEPOSIT) {
      res.message = "优惠存款金额不符合规则";
      return res;
    }
    if (res.code === ResponseCode.ERROR_UNAUTHORIZED) {
      store.token = null;
      location.reload();
    } else {
      if (
        res.code === ResponseCode.ERROR_TOKEN_EXPIRED ||
        res.code === ResponseCode.ERROR_TOKEN_MISSED ||
        res.code === ResponseCode.ERROR_NAME_EXIST
      ) {
        store.token = null;
        location.reload();
      }
      if (res.code === ResponseCode.ERROR_TOKEN_LOGGED) {
        sessionStorage.setItem("ERROR_TOKEN_LOGGED", "1");
        store.token = null;
        window.location.href = "/home";
        return;
      }
      if (
        (res.code === ResponseCode.ERROR_USER_TOO_FAST ||
          res.code === ResponseCode.ERROR_PROMO_NOT_STARTED ||
          res.code === ResponseCode.ERROR_PROMO_USER_NOT_MEET_REQUIREMENT ||
          res.code === ResponseCode.ERROR_PROMO_CLAIMED ||
          res.code === ResponseCode.ERROR_PROMO_NOT_IN_RANGE ||
          res.code === ResponseCode.ERROR_SYSTEM) &&
        window.location.href.indexOf("?name=lh1-daily-checkin") === -1
      ) {
        ui.notify({
          type: "error",
          message: res.message
        });
      }
      if (res.code === ResponseCode.ERROR_EMPTY_ADS) {
        console.log(res);
        return res;
      }
      // if (res.code === 36001 || 36002 || 36003 || 36004 || 36005 || 36006 || 36007 || 36008 || 36009) {
      //   // 龙卡
      //   return res
      // }
      // message.error(res.message, 4);
      // ElMessage.error(res.message);
    }
    // throw new Error(res.message || "Error");
    return res;
  } else {
    return response.data;
  }
};

const onResponseError = (error) => {
  const ui = uiStore();
  // message.error(error.message);

  ui.notify({
    type: "warning",
    message: error.message
  });
  return Promise.reject(error);
};

function initHttp() {
  const host = document.location.host;
  const instance = axios.create({
    headers: {
      domain: host
    },
    timeout: process.env.VUE_APP_TIMEOUT
  });
  instance.interceptors.request.use(onRequest);
  instance.interceptors.response.use(onResponse, onResponseError);
  return instance;
}

let instance = null;

export const server = new Proxy(
  {
    REST: null,
    EVENT: null,
    CASHIER: null
  },
  {
    get: (target, propKey) => {
      if (!instance) {
        instance = initHttp();
      }
      if (propKey === "REST") {
        instance.defaults.baseURL = rstApi;
      } else if (propKey === "EVENT") {
        instance.defaults.baseURL = evtApi;
      } else if (propKey === "CASHIER") {
        instance.defaults.baseURL = crtApi;
      }
      return instance;
    }
  }
);
