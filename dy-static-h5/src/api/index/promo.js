import { cached } from "boot/cache";
import { api, eventapi } from "boot/axios";

const qs = require("qs");

export function claimBonusItem(item) {
  return cached.put(`/bonus/claim/${item}`);
}

export function loadPromoBanner(category) {
  return api.get(`/promo/banner?category=${category}`);
}

export function claimBonusItem2(item) {
  return eventapi.put(`/bonus/claim/${item}`);
}

export function getSportMatchQuizInfo() {
  return eventapi.get(`/quiz/upcoming`, {});
}

export function getMemberSportMatchRecord(number, size) {
  return eventapi.get(`/quiz/answeredRecords?size=${size}&current=${number}`, {});
}

export function getMemberSportQuizTotal() {
  return eventapi.get(`/quiz/recordsCount`, {});
}

export function submitMemberSportMatchQuiz(param) {
  const { quizId, quizTitle, answerOne, answerTwo, answerThree } = param;
  return eventapi.post(
    `/quiz/submit`,
    qs.stringify({
      quizId,
      quizTitle,
      answerOne,
      answerTwo,
      answerThree
    })
  );
}

export function submitLuckyNumber(item) {
  return eventapi.post(
    `/privi/lotteryNumber`,
    qs.stringify({
      number: item,
      promoCode: "dy2-lottery"
    })
  );
}

export function luckyNumberList(queryItems, memberId) {
  return eventapi.get(`/privi/selectedNumbers`, {
    params: {
      winStatus: queryItems.winStatus,
      recordTime: queryItems.recordTime,
      memberId: memberId
    }
  });
}

export function winnerList(queryItems) {
  return eventapi.get(`/privi/winners`, {
    params: {
      resultTime: queryItems.resultTime
    }
  });
}

export function getGiftList() {
  return eventapi.get(`/gift/list`, {});
}

export function getGiftBet() {
  return eventapi.get(`/gift/monthBet`, {});
}

export function redeemGift(param) {
  const { giftId, recipient, recipientTelephone, address } = param;
  return eventapi.post(
    `/gift/redeem?giftId=${giftId}&recipient=${recipient}&recipientTelephone=${recipientTelephone}&address=${address}`,
    {}
  );
}

export function getGiftRecord() {
  return eventapi.get(`/gift/record`, {});
}

export function getBBDachaUpcoming() {
  return eventapi.get(`/bb-dacha/upcoming`, {});
}

export function getBBDachaAnsweredRecords() {
  return eventapi.get(`/bb-dacha/answeredRecords`, {});
}

export function submitBBDacha(param) {
  const { quizId, quizTitle, answerOne } = param;
  return eventapi.post(`/bb-dacha/submit`, qs.stringify({ quizId, quizTitle, answerOne }));
}

export function getBBDachaRecordsCount() {
  return eventapi.get(`/bb-dacha/recordsCount`, {});
}

export function getTreasureDetail(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/event-treasure/get-treasure-detail/${promoCode}?v=${randNum}`);
}
export function getKeyCount(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/event-treasure/get-key?v=${randNum}`, {
    params: {
      promoCode
    }
  });
}
export function getOpenRecord(promoCode, page) {
  console.log(page);
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/event-treasure/get-open-record/${promoCode}?v=${randNum}`, {
    size: page.size,
    current: page.current
  });
}

export function getKeyRecord(promoCode, page) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/event-treasure/get-key-record/${promoCode}?v=${randNum}`, {
    size: page.size,
    current: page.current
  });
}

export function openTreasure(promoCode, treasureLevel) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.post(`/event-treasure/open?v=${randNum}`, qs.stringify({ promoCode, treasureLevel }));
}

export function getCheckInRecord(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/event-check-in/get-record?v=${randNum}`, {
    params: {
      promoCode
    }
  });
}

export function claimCheckInTreasure(promoCode, days) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.post(`/event-check-in/open?v=${randNum}`, qs.stringify({ promoCode, days }));
}

export function getBountyInit(promoCode) {
  return eventapi.get(`/session/event-check-in/can-claim?promoCode=${promoCode}`);
}
export function claimBountyBonus(promoCode) {
  return eventapi.post(`/session/event-check-in/claim?promoCode=${promoCode}`);
}

export function getLOLMsiMatchRecord() {
  return eventapi.get("/game-match/upcoming/MSI");
}

export function getLplSummer24Match() {
  return eventapi.get("game-match/upcoming/MSI");
}

export function duanwuVipUpgrade() {
  return eventapi.post("/duan-wu/vip-upgrade");
}
export function duanwuDepositBet() {
  return eventapi.post("/duan-wu/deposit-bet");
}

export function getNewUserSetupBonusInit() {
  return eventapi.get("/new-user-setup-bonus/init");
}

export function putNewUserSetupBonusClaim(promoCode) {
  return eventapi.put(`/new-user-setup-bonus/claim?promoCode=${promoCode}`, {});
}

export function getNewUserAccumulateDepositInit() {
  return eventapi.get("/new-user-accumulate-deposit/init");
}

export function putNewUserAccumulateDepositClaim(ruleAmount) {
  return eventapi.put(`/new-user-accumulate-deposit/claim?ruleAmount=${ruleAmount}`, {});
}

export function getEurocupManualSchedule() {
  return eventapi.get("/uefa/match/all");
}

export function getSportMatch() {
  return eventapi.get("/sport-match/today");
}

export function claimItems(status, level) {
  if (status === "upgrade") {
    return eventapi.post("/vip-bonus/claim-upgrade-bonus?_method=PUT", qs.stringify({ vipLevel: level }));
  }
  if (status === "birthday") {
    return eventapi.put("/vip-bonus/claim-birthday-bonus");
  }
  if (status === "retain") {
    return eventapi.post("/vip-bonus/claim-first-retain?_method=PUT", qs.stringify({ vipLevel: level }));
  }
  if (status === "monthly") {
    return eventapi.put("/vip-bonus/claim-monthly-bonus");
  }
  if (status === "yearlyRetain") {
    return eventapi.post("/vip-bonus/claim-yearly-retain?_method=PUT", qs.stringify({ vipLevel: level }));
  }
  if (status === "coupon") {
    return eventapi.put("/vip-bonus/claim-coupon");
  }
  if (status === "redPacket") {
    return eventapi.put("/vip-bonus/claim-red-packet");
  }
  if (status === "all") {
    return eventapi.put("/vip-bonus/claim-all");
  }
}

export function getVIPDetails() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/vip-bonus/get-detail?v=${randNum}`);
}

export function getVIPDetailsNotLoggedIn() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/get-vip-bonus-detail?siteId=6&v=${randNum}`);
}

export function getLivePoker() {
  return eventapi.get("/live-poker");
}

export function claimLivePokerBonus(item) {
  return eventapi.put(`/bonus/claim/${item}`);
}

export function footballHistroy() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/lh1-football/history?v=${randNum}`);
}

export function footballEligibility() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/lh1-football/eligibility?v=${randNum}`);
}

export function getCompetitionBetToday(promoCode) {
  return eventapi.get(`/competition-bet/yesterday`, {
    params: {
      promoCode
    }
  });
}

export function getDota2CompetitionBet(promoCode) {
  return eventapi.get(`/dota2-competition-bet/yesterday`, {
    params: {
      promoCode
    }
  });
}

export function getBlastCoupon() {
  return eventapi.get("/session/blastCoupon/init");
}

export function claimBlastCoupon(promoCode) {
  return eventapi.post(`/session/blastCoupon/claim`, qs.stringify({ promoCode }));
}

export function getBlastCouponInit() {
  return eventapi.get("/session/blastCoupon/init");
}
export function getCompetitionToday() {
  return eventapi.get("/session/competition/today");
}

export function getCompetitionYesterday(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/competition/yesterday?v=${randNum}`, {
    params: {
      promoCode
    }
  });
}

export function claimCompetitionBonus(promoCode) {
  return eventapi.post("/session/competition/claimBonus", qs.stringify({ promoCode }));
}

export function claimCompetitionBetBonus(promoCode) {
  return eventapi.post("/session/competition-bet/claimBonus", qs.stringify({ promoCode }));
}

export function getCompetitionBetYesterday(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/competition-bet/yesterday?v=${randNum}`, {
    params: {
      promoCode
    }
  });
}
export function getGameTypeBonusInit(promoCode) {
  return eventapi.get("/session/game-type-bonus/init", {
    params: {
      promoCode
    }
  });
}

export function claimGameTypeBonus(promoCode) {
  return eventapi.post(`/session/game-type-bonus/claim`, qs.stringify({ promoCode }));
}

export function getNBAUpcomingMatch() {
  return eventapi.get("/session/nba-match-preseason/upcoming");
}

export function getNBAClaimHistory() {
  return eventapi.get("/session/nba-match-preseason/history");
}

export function claimNBABonus(matchId) {
  return eventapi.post(`/session/nba-match-preseason/claim?matchId=${matchId}`);
}

export function getPGLTreasureInit() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/pglTreasure/init?v=${randNum}`);
}

export function putPGLTreasureInit() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.put(`/session/pglTreasure/claim?v=${randNum}`);
}

export function getIEMRioInit() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/iem-rio/init?v=${randNum}`);
}

export function claimIEMRioBonus() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.post(`/session/iem-rio/claimBonus?v=${randNum}`);
}

export function getCBAInit() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/cba/daily/init?v=${randNum}`);
}

export function claimCBADailyBonus() {
  return eventapi.post(`/session/cba/daily/claimBonus`);
}

export function getCBAWeeklyInit() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/cba/weekly/init?v=${randNum}`);
}

export function claimCBAWeeklyBonus() {
  return eventapi.post("/session/cba/weekly/claimBonus");
}

export function getMatchAndPrizeInfo(type) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/privi/memberSlotBetInfo?type=${type}&v=${randNum}`);
}

export function getPrizeMoney(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.put(`/bonus/claim/${promoCode}?v=${randNum}`);
}

export function getBelgradeInit(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/bb-dacha-belgrade/init?v=${randNum}`, qs.stringify({ promoCode }));
}

export function claimBelgradeBonus(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.post(`/session/bb-dacha-belgrade/claimBonus?v=${randNum}`, qs.stringify({ promoCode }));
}

export function getVctBangkokInit(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/competition/yesterday?promoCode=${promoCode}&v=${randNum}`);
}
export function claimVctBangkokBonus(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.post(`/session/competition/claimBonus?promoCode=${promoCode}&v=${randNum}`);
}

export function getCompetitionBetDepositInit(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/competition-bet-deposit/init?v=${randNum}`, {
    params: {
      promoCode
    }
  });
}

export function claimCompetitionBetDepositBonus(promoCode) {
  return eventapi.post(`/session/competition-bet-deposit/claimBonus`, qs.stringify({ promoCode }));
}

export function getCycleLossRefundInit(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/cycle-loss-refund/init?v=${randNum}`, {
    params: {
      promoCode
    }
  });
}

export function claimCycleLossRefund(promoCode) {
  return eventapi.post(`/session/cycle-loss-refund/claim`, qs.stringify({ promoCode }));
}

export function getCompetitionLossInit(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/competition-loss/init?v=${randNum}`, {
    params: {
      promoCode
    }
  });
}

export function claimCompetitionLoss(promoCode) {
  return eventapi.post(`/session/competition-loss/claim`, qs.stringify({ promoCode }));
}
export function getVctcnInit(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/competition-bet-platform/init?promoCode=${promoCode}&v=${randNum}`);
}

export function claimVctcnBonus(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.post(`/session/competition-bet-platform/claimBonus?promoCode=${promoCode}&v=${randNum}`);
}

export function getSkyesportsSouvenir2025Bonus(promoCode) {
  return eventapi.get(`/session/competition-payout-deposit/init?promoCode=${promoCode}`);
}
export function claimSkyesportsSouvenir2025Bonus(promoCode) {
  return eventapi.post(`/session/competition-payout-deposit/claimBonus?promoCode=${promoCode}`);
}

export function getPGLBucharest2025Bonus(promoCode) {
  return eventapi.get(`/session/competition/yesterday?promoCode=${promoCode}`);
}
export function claimPGLBucharest2025Bonus(promoCode) {
  return eventapi.post(`/session/competition/claimBonus?promoCode=${promoCode}`);
}

export function getFissureUniverseS4Bonus(promoCode) {
  return eventapi.get(`/session/competition/yesterday?promoCode=${promoCode}`);
}
export function claimFissureUniverseS4Bonus(promoCode) {
  return eventapi.post(`/session/competition/claimBonus?promoCode=${promoCode}`);
}

export function getIemMelbourne2025Bonus(promoCode) {
  return eventapi.get(`/session/competition/yesterday?promoCode=${promoCode}`);
}
export function claimIemMelbourne2025Bonus(promoCode) {
  return eventapi.post(`/session/competition/claimBonus?promoCode=${promoCode}`);
}

export function getPglWallachiaS4Bonus(promoCode) {
  return eventapi.get(`/session/competition/yesterday?promoCode=${promoCode}`);
}
export function claimPglWallachiaS4Bonus(promoCode) {
  return eventapi.post(`/session/competition/claimBonus?promoCode=${promoCode}`);
}

export function getMesaInit(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/competition/yesterday?promoCode=${promoCode}&v=${randNum}`);
}

export function claimMesaBonus(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.post(`/session/competition/claimBonus?promoCode=${promoCode}&v=${randNum}`);
}

export function getBlastRival2025Bonus(promoCode) {
  return eventapi.get(`/session/competition-loss/init?promoCode=${promoCode}`);
}
export function claimBlastRival2025Bonus(promoCode) {
  return eventapi.post(`/session/competition-loss/claim?promoCode=${promoCode}`);
}

export function getIemDallas2025Bonus(promoCode) {
  return eventapi.get(`/session/competition/yesterday?promoCode=${promoCode}`);
}
export function claimIemDallas2025Bonus(promoCode) {
  return eventapi.post(`/session/competition/claimBonus?promoCode=${promoCode}`);
}
export function getDreamLeagueS26Bonus(promoCode) {
  return eventapi.get(`/session/competition/yesterday?promoCode=${promoCode}`);
}
export function claimDreamLeagueS26Bonus(promoCode) {
  return eventapi.post(`/session/competition/claimBonus?promoCode=${promoCode}`);
}

export function getTokenRewardsInit(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/token-rewards/init?promoCode=${promoCode}&v=${randNum}`);
}

export function receiveTokenRewards(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.post(`/session/token-rewards/receiveToken?promoCode=${promoCode}&v=${randNum}`);
}

export function claimTokenRewardsBonus(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.post(`/session/token-rewards/claimBonus?promoCode=${promoCode}&v=${randNum}`);
}

export function getTokenRecords(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/token-rewards/tokenRecords?promoCode=${promoCode}&v=${randNum}`);
}

export function getRewardsRecords(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/token-rewards/rewardRecords?promoCode=${promoCode}&v=${randNum}`);
}

export function claimChestBlastAustin(promoCode, type) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.post(`/session/mission/claim?promoCode=${promoCode}&v=${randNum}&type=${type}`);
}

export function selectMissionBlastAustin(promoCode, missionNum) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.post(`/session/mission/select?promoCode=${promoCode}&mission=${missionNum}&v=${randNum}`);
}

export function initBlastAustin(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/mission/init?promoCode=${promoCode}&v=${randNum}`);
}

export function getTorontoMastersInit() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/competition-loss/init?promoCode=dy2-valorant-masters-toronto-2025&v=${randNum}`);
}

export function claimTorontoMastersBonus() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.post(`/session/competition-loss/claim?promoCode=dy2-valorant-masters-toronto-2025&v=${randNum}`);
}

export function getFifa2025PromoInit() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/competition/yesterday?promoCode=dy2-fifa-2025&v=${randNum}`);
}

export function claimFifa2025PromoBonus() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.post(`/session/competition/claimBonus?promoCode=dy2-fifa-2025&v=${randNum}`);
}

export function getDailySlotBonusInit() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/game-type-bonus/init?promoCode=dy2-daily-slot-bonus&v=${randNum}`);
}

export function claimDailySlotBonus() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.post(`/session/game-type-bonus/claim?promoCode=dy2-daily-slot-bonus&v=${randNum}`);
}

export function getNewUserSportBonus2025Bonus(promoCode) {
  return eventapi.get(`/session/game-type-bonus/init?promoCode=${promoCode}`);
}
export function claimNewUserSportBonus2025Bonus(promoCode) {
  return eventapi.post(`/session/game-type-bonus/claim?promoCode=${promoCode}`);
}
