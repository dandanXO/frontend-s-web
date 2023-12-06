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
export function claimBonusItem(item) {
  return server.EVENT.put(`/bonus/claim/${item}`);
}

export function claimDailyRainItem(item) {
  return server.EVENT.get(`/redPacketVip/claim?promoCode=${item}`);
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
    promoCode: "dy2-lottery"
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

export function getSportMatchQuizInfo() {
  return server.EVENT.get(`/quiz/upcoming`, {});
}

export function getMemberSportMatchRecord() {
  return server.EVENT.get(`/quiz/answeredRecords`, {});
}

export function submitMemberSportMatchQuiz(param) {
  const { quizId, quizTitle, answerOne, answerTwo, answerThree } = param;
  return server.EVENT.post(`/quiz/submit`, {
    quizId,
    quizTitle,
    answerOne,
    answerTwo,
    answerThree
  });
}

export function getGiftList() {
  return server.EVENT.get(`/gift/list`, {});
}

export function getGiftBet() {
  return server.EVENT.get(`/gift/monthBet`, {});
}

export function redeemGift(param) {
  const { giftId, recipient, recipientTelephone, address } = param;
  return server.EVENT.post(
    `/gift/redeem?giftId=${giftId}&recipient=${recipient}&recipientTelephone=${recipientTelephone}&address=${address}`,
    {}
  );
}

export function getGiftRecord() {
  return server.EVENT.get(`/gift/record`, {});
}
