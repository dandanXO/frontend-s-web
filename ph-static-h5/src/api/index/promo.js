import { api, eventapi } from "src/boot/axios";
import { userStore } from "stores/index";

export function loadPromo() {
  const store = userStore();
  const promoApiUrl = store.token ? "/session/loggedInPromoPages" : "/promo/page";

  return server.REST.get(promoApiUrl);
}

export function loadPromoBanner(category) {
  return api.get("/promo/banner", {
    params: {
      category: category
    }
  });
}

export function spinWheel() {
  return eventapi.get(`/privi/roulette/spin`);
}
export function spinWheelProgress(item) {
  return eventapi.get(`/privi/roulette/checkProgress`, {
    params: {
      promoCode: item
    }
  });
}
export function spinRoulette(params) {
  return eventapi.post(`/privi/roulette/spin`, params);
}

// Daily Login Cash Bonus Start
export function getTodayCheckInStatus(params) {
  return eventapi.get("/privi/vipDailyCheckIn/getTodayCheckInStatus", {
    params
  });
}

export function checkIn(params) {
  return eventapi.post("/privi/vipDailyCheckIn/checkin", params);
}

export function reCheckIn(params) {
  return eventapi.post("/privi/vipDailyCheckIn/reCheckin", params);
}

export function kycAPI() {
  return eventapi.get("/privi/memberValidate/getMemberValidateInfo");
}
// Daily Login Cash Bonus End

// ads popup list
export function getAdsPopupList() {
  return eventapi.get("/adsPopup/list");
  // return eventapi.get("/privi/adsPopup/list");
}
