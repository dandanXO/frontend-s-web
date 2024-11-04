import { server } from "@/utils/request";
import cached from "@/utils/cache";

export function loadPromo(isLogin = false) {
  return server.REST.get("/opt-session/promo/page");
}

export function loadPromoBanner(category) {
  return server.REST.get("/opt-session/promo/banner", {
    params: {
      category: category
    }
  });
}

export function loadPromoTypes() {
  return cached.get("PROMOTION_TYPES", () => server.REST.get("/promo/type"));
}

export function claimBonusItem(item) {
  return server.EVENT.put(`/bonus/claim/${item}`);
}

export function claimDailyRainItem(item) {
  return server.EVENT.get(`/redPacketVip/claim?promoCode=${item}`);
}
export function getDailyRainListing(item) {
  return server.EVENT.get(`/redPacketVip/list?promoCode=${item}`);
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

export function getMemberSportMatchRecord(record) {
  return server.EVENT.get(`/quiz/answeredRecords`, {
    params: {
      size: record.size,
      current: record.current
    }
  });
}

export function getRecordsCount() {
  return server.EVENT.get(`/quiz/recordsCount`, {});
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

export function promoApply(param) {
  const { promoCode, promoTitle } = param;
  return server.EVENT.post(`/promo-application/apply`, { promoCode, promoTitle });
}

export function promoApplyWithGameType(param) {
  const { promoCode, promoTitle, gameType } = param;
  return server.EVENT.post(`/promo-application/apply`, { promoCode, promoTitle, gameType });
}

export function getBBDachaUpcoming() {
  return server.EVENT.get(`/bb-dacha/upcoming`, {});
}

export function getBBDachaAnsweredRecords() {
  return server.EVENT.get(`/bb-dacha/answeredRecords`, {});
}

export function submitBBDacha(param) {
  const { quizId, quizTitle, answerOne } = param;
  return server.EVENT.post(`/bb-dacha/submit`, { quizId, quizTitle, answerOne });
}

export function getBBDachaRecordsCount() {
  return server.EVENT.get(`/bb-dacha/recordsCount`, {});
}

export function getCurrentStepInit() {
  return server.EVENT.get(`/game-steps/initiate`, {});
}

export function submitGameStep(param) {
  const { stage } = param;
  return server.EVENT.post(`/game-steps/step`, { stage });
}

export function getStepRecords(current, currentStage) {
  return server.EVENT.get(`/game-steps/records`, {
    params: {
      size: 10,
      current: current,
      stage: currentStage
    }
  });
}
export function getTreasureDetail(promoCode) {
  return server.EVENT.get(`/event-treasure/get-treasure-detail/${promoCode}`);
}
export function getKeyCount(promoCode) {
  return server.EVENT.get(`/event-treasure/get-key`, {
    params: {
      promoCode
    }
  });
}
export function getOpenRecord(promoCode, page) {
  console.log(page);
  return server.EVENT.get(`/event-treasure/get-open-record/${promoCode}`, {
    size: page.size,
    current: page.current
  });
}

export function getKeyRecord(promoCode, page) {
  return server.EVENT.get(`/event-treasure/get-key-record/${promoCode}`, {
    size: page.size,
    current: page.current
  });
}

export function openTreasure(promoCode, treasureLevel) {
  return server.EVENT.post(`/event-treasure/open`, { promoCode, treasureLevel });
}

export function getCheckInRecord(promoCode) {
  return server.EVENT.get(`/event-check-in/get-record`, {
    params: {
      promoCode
    }
  });
}

export function claimCheckInTreasure(promoCode, days) {
  return server.EVENT.post(`/event-check-in/open`, { promoCode, days });
}

export function getLOLMsiMatchRecord() {
  return server.EVENT.get("/game-match/upcoming/MSI");
}

export function getLplSummer24Match() {
  return server.EVENT.get("game-match/upcoming/MSI");
}

export function duanwuVipUpgrade() {
  return server.EVENT.post("/duan-wu/vip-upgrade");

  const requestOptions = {
    method: "POST",
    headers: {
      token: `${userStore().token}`,
      "Content-Type": "application/json"
    }
  };
  var evtUrl = localStorage.getItem("DY_WEB_EVT_URL");

  return fetch(evtUrl + "/duan-wu/vip-upgrade", requestOptions)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function duanwuDepositBet() {
  return server.EVENT.post("/duan-wu/deposit-bet");
  const requestOptions = {
    method: "POST",
    headers: {
      token: `${userStore().token}`,
      "Content-Type": "application/json"
    }
  };
  var evtUrl = localStorage.getItem("DY_WEB_EVT_URL");

  return fetch(evtUrl + "/duan-wu/deposit-bet", requestOptions)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
export function getSportMatch() {
  return server.EVENT.get("/sport-match/today");
}

export function loadHomePopup() {
  return server.REST.get("/member/ads-popout");
}

export function getOlympicFirstDeposit() {
  return server.EVENT.get("/lhOlympicDailyFirstDeposit/init");
}

export function claimOlympicFirstDeposit() {
  return server.EVENT.put("/lhOlympicDailyFirstDeposit/claim");
}

export function getOlympicDailySportBet() {
  return server.EVENT.get("/lhOlympicDailySportBet/init");
}

export function claimOlympicDailySportBet() {
  return server.EVENT.put("/lhOlympicDailySportBet/claim");
}

export function getNewUserSetupBonusInit() {
  return server.EVENT.get("/new-user-setup-bonus/init");
}

export function putNewUserSetupBonusClaim(promoCode) {
  return server.EVENT.put(`/new-user-setup-bonus/claim?promoCode=${promoCode}`, {});
}

export function getNewUserAccumulateDepositInit() {
  return server.EVENT.get("/new-user-accumulate-deposit/init");
}

export function putNewUserAccumulateDepositClaim(ruleAmount) {
  return server.EVENT.put(`/new-user-accumulate-deposit/claim?ruleAmount=${ruleAmount}`, {});
}

export function getLivePoker() {
  return server.EVENT.get("/live-poker");
}

export function claimLivePokerBonus() {
  return server.EVENT.put("/bonus/claim/lh1-live-poker-bonus");
}

export function footballHistroy() {
  return server.EVENT.get("/lh1-football/history");
}

export function getCompetitionBetToday(promoCode) {
  return server.EVENT.get(`/competition-bet/yesterday`, {
    params: {
      promoCode
    }
  });
}

export function getDota2CompetitionBet(promoCode) {
  return server.EVENT.get(`/dota2-competition-bet/yesterday`, {
    params: {
      promoCode
    }
  });
}

export function getBlastCoupon() {
  return server.EVENT.get("/session/blastCoupon/init");
}

export function claimBlastCoupon(promoCode) {
  return server.EVENT.post("/session/blastCoupon/claim", {
    params: {
      promoCode
    }
  });
}

export function getBlastCouponInit() {
  return server.EVENT.get("/session/blastCoupon/init");
}

export function getCompetitionToday() {
  return server.EVENT.get("/session/competition/today");
}

export function getCompetitionYesterday(promoCode) {
  return server.EVENT.get("/session/competition/yesterday", {
    params: {
      promoCode
    }
  });
}

export function claimCompetitionBonus(promoCode) {
  return server.EVENT.post("/session/competition/claimBonus", { promoCode });
}

export function claimCompetitionBetBonus(promoCode) {
  return server.EVENT.post("/session/competition-bet/claimBonus", { promoCode });
}

export function getNationalDayinit() {
  return server.EVENT.get("/session/nationalDay/init");
}
export function getNationalDayRecords() {
  return server.EVENT.get("/session/nationalDay/records");
}

export function claimNationalDayBonus() {
  return server.EVENT.post("/session/nationalDay/claimBonus");
}

export function getCompetitionBetYesterday(promoCode) {
  return server.EVENT.get("/session/competition-bet/yesterday", {
    params: {
      promoCode
    }
  });
}

export function getNBAUpcomingMatch() {
  return server.EVENT.get("/session/nba-match-preseason/upcoming");
}

export function getNBAClaimHistory() {
  return server.EVENT.get("/session/nba-match-preseason/history");
}

export function claimNBABonus(matchId) {
  return server.EVENT.post(`/session/nba-match-preseason/claim?matchId=${matchId}`);
}

export function getPglTreasureInit() {
  return server.EVENT.get("/session/pglTreasure/init");
}

export function putPglTreasureInit() {
  return server.EVENT.put("/session/pglTreasure/claim");
}

export function getIEMRioInit() {
  return server.EVENT.get("/session/iem-rio/init");
}
export function claimIEMRioBonus() {
  return server.EVENT.post("/session/iem-rio/claimBonus");
}

export function getMatchAndPrizeInfo(type) {
  return server.EVENT.get(`/privi/memberSlotBetInfo?type=${type}`);
}

export function getPrizeMoney(promoCode) {
  return server.EVENT.put(`/bonus/claim/${promoCode}`);
}

export function getCBAInit() {
  return server.EVENT.get("/session/cba/daily/init");
}

export function claimCBADailyBonus() {
  return server.EVENT.post("/session/cba/daily/claimBonus");
}

export function getCBAWeeklyInit() {
  return server.EVENT.get("/session/cba/weekly/init");
}

export function claimCBAWeeklyBonus() {
  return server.EVENT.post("/session/cba/weekly/claimBonus");
}

export function loadAffiliateByDomain(host, siteCode) {
  return server.REST.get(`/app/getAffiliateCode?siteCode=${siteCode}&domain=${host}`);
}

export function getYallaCompassInit() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return server.EVENT.get(`/session/competition-bet-deposit/init?promoCode=dy2-yalla-compass&v=${randNum}`);
}
export function claimYallaCompassBonus() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return server.EVENT.post(`/session/competition-bet-deposit/claimBonus?promoCode=dy2-yalla-compass&v=${randNum}`);
}

export function getBelgradeInit(promoCode) {
  return server.EVENT.get("/session/bb-dacha-belgrade/init", { promoCode });
}
export function claimBelgradeBonus(promoCode) {
  return server.EVENT.post("/session/bb-dacha-belgrade/claimBonus", { promoCode });
}
export function getElisaGiftInit() {
  // return server.EVENT.get("/session/elisa-gift/init");
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return server.EVENT.get(`/session/competition-bet-deposit/init?promoCode=dy2-yalla-compass&v=${randNum}`);
}
export function claimElisaGiftBonus() {
  // return server.EVENT.post("/session/elisa-gift/claimBonus");
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return server.EVENT.post(`/session/competition-bet-deposit/claimBonus?promoCode=dy2-yalla-compass&v=${randNum}`);
}

export function getCompetitionBetDepositInit(promoCode) {
  return server.EVENT.get("/session/competition-bet-deposit/init", {
    params: {
      promoCode
    }
  });
}

export function claimCompetitionBetDepositBonus(promoCode) {
  return server.EVENT.post("/session/competition-bet-deposit/claimBonus", { promoCode });
}

export function getCycleLossRefundInit(promoCode) {
  return server.EVENT.get("/session/cycle-loss-refund/init", {
    params: {
      promoCode
    }
  });
}

export function claimCycleLossRefund(promoCode) {
  return server.EVENT.post("/session/cycle-loss-refund/claim", { promoCode });
}
