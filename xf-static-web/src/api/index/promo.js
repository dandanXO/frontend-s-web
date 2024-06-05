import { server } from "@/utils/request";

export function loadPromo(isLogin = false) {
  const platformApiUrl = isLogin ? "/session/loggedInPromoPages" : "/promo/page";

  return server.REST.get(platformApiUrl);
}

export function loadPromoBanner(category) {
  return server.REST.get("/promo/banner", {
    params: {
      category: category
    }
  });
}
export function loadHomePromoBanner() {
  return server.REST.get("/member/ads-popout");
}

export function claimBonusItem(item) {
  return server.EVENT.put(`/bonus/claim/${item}`);
}
export function welcomeTaskInit() {
  return server.EVENT.post(`/welcomeTask/init`);
}

export function welcomeTaskClaimBonus(item) {
  return server.EVENT.put(`/welcomeTask/claim/${item}`);
}

export function submitLuckyNumber(item) {
  return server.EVENT.post(`/privi/lotteryNumber`, {
    number: item,
    promoCode: "xf-iphone"
  });
}

export function luckyNumberList(queryItems, memberId) {
  var betweenDate = null;
  if (queryItems.recordTimeStart && queryItems.recordTimeEnd) {
    betweenDate = queryItems.recordTimeStart + "," + queryItems.recordTimeEnd;
  }

  return server.EVENT.get(`/privi/selectedNumbers`, {
    params: {
      winStatus: queryItems.winStatus,
      recordTimeBetween: betweenDate,
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

export function claimDailyRainItem(item) {
  return server.EVENT.get(`/redPacketVip/claim?promoCode=${item}`);
}

export function getDailyRainListing(item) {
  return server.EVENT.get(`/redPacketVip/list?promoCode=${item}`);
}
