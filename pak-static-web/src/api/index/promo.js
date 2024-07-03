import { server } from "@/utils/request";
import { userStore } from "@/store";

export function loadPromo() {
  const store = userStore();
  const promoApiUrl = store.token ? "/session/loggedInPromoPages" : "/promo/page";

  return server.REST.get(promoApiUrl);
}

export function loadPromoBanner(category) {
  return server.REST.get("/promo/banner", {
    params: {
      category: category
    }
  });
}
export function claimBonusItem(item) {
  return server.EVENT.put(`/bonus/claim/${item}`);
}

export function submitLuckyNumber(item) {
  return server.EVENT.post(`/privi/lotteryNumber`, {
    number: item,
    promoCode: "jollybet-iphone"
  });
}

export function luckyNumberList(queryItems, memberId) {
  return server.EVENT.get(`/privi/selectedNumbers`, {
    params: {
      winStatus: queryItems.winStatus,
      recordTime: queryItems.recordTime,
      memberId: memberId
    }
  });
}

export function winnerList(queryItems) {
  return server.EVENT.get(`/privi/winners`, {
    params: {
      resultTime: queryItems.resultTime
    }
  });
}

export function getSJBList() {
  return server.EVENT.get(`/privi/team-votes/init`, {});
}
export function postVote(item) {
  return server.EVENT.post(`/privi/team-votes/vote`, {
    teamId: item.teamId,
    votes: item.voteCount
  });
}
export function getInviteFriendList(item) {
  return server.REST.get(`/session/referred`, {
    params: {
      memberId: item.memberId,
      loginName: item.loginName,
      regTime: item.regTime,
      current: item.current
    }
  });
}

export function spinRoulette(item) {
  return server.EVENT.post(`/privi/roulette/spin`, {
    promoCode: item
  });
}
export function spinWheelProgress(item) {
  return server.EVENT.get(`/privi/roulette/checkProgress`, {
    params: {
      promoCode: item
    }
  });
}
export function kycAPI() {
  return server.EVENT.get(`/privi/memberValidate/getMemberValidateInfo`);
}

// Daily Login Cash Bonus Start
export function getTodayCheckInStatus(item) {
  return server.EVENT.get("/privi/vipDailyCheckIn/getTodayCheckInStatus", {
    params: {
      promoCode: item
    }
  });
}

export function checkIn(params) {
  return server.EVENT.post("/privi/vipDailyCheckIn/checkin", params);
}

export function reCheckIn(params) {
  return server.EVENT.post("/privi/vipDailyCheckIn/reCheckin", params);
}
// Daily Login Cash Bonus End

export function getJiliRanks() {
  return server.REST.get("/top-winner/top-bet");
}

// ads popup list
export function getAdsPopupList() {
  return server.EVENT.get("/adsPopup/list");
  // return server.EVENT.get("/privi/adsPopup/list");
}

export function loadHomePopup() {
  return server.REST.get("/member/ads-popout");
}

// hotpromo: pak-spin-wheel
export function getAviatorWheelRecords() {
  return server.EVENT.get("/aviatorWheel/records");
}

export function postAviatorWheelSpin() {
  return server.EVENT.post("/aviatorWheel/spin");
}

export function getAviatorWheelInit() {
  return server.EVENT.get("/aviatorWheel/init");
}

// hotpromo: pak-signin-bonus
export function getNewRegcheckInInit() {
  return server.EVENT.get("/newRegCheckIn/init");
}

export function claimNewRegCheckIn() {
  return server.EVENT.post("/newRegCheckIn/claimBonus");
}
