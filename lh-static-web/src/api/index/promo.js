import { server } from "@/utils/request";
import { userStore } from "@/store";
import cached from "@/utils/cache";

export function loadPromo() {
  return server.REST.get("/opt-session/promo/page");
}

export function loadPromoTypes(category) {
  return cached.get("PROMOTION_TYPES", () => server.REST.get("/promo/type"));
}

export function loadPromoBanner(category) {
  return server.REST.get("/opt-session/promo/banner", {
    params: {
      category: category
    }
  });
}

export function loadHomePopup() {
  return server.REST.get("/member/ads-popout");
}

export function loadHomePopups(siteType) {
  if (siteType) {
    return server.REST.get("/member/site-popout-list", {
      params: {
        siteType: siteType
      }
    });
  }
  return server.REST.get("/member/site-popout-list");
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
    promoCode: "lh1-lottery"
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

export function getTeamVotes() {
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

export function claimCheckInTreasure(promoCode, days) {
  return server.EVENT.post(`/event-check-in/open`, { promoCode, days });
}

export function checkInInfo() {
  return server.EVENT.get(`/sign-in/info`);
}

export function signIn() {
  return server.EVENT.put(`/sign-in/claim`);
}

export function getVIPDetails() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return server.EVENT.get(`/vip-bonus/get-detail?v=${randNum}`);
}

export function getVIPDetailsNotLoggedIn() {
  const store = userStore();
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return server.EVENT.get(`/get-vip-bonus-detail?siteId=${store.siteId}&v=${randNum}`);
}
export function canRedeem() {
  return server.EVENT.get("/vip-upgrade/lh/canRedeem");
}
export function claim(level) {
  return server.EVENT.post("/vip-upgrade/lh/claim", { vipLevel: level });
}

export function claimItems(status, level) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  if (status === "upgrade") {
    return server.EVENT.post("/vip-bonus/claim-upgrade-bonus?_method=PUT", { vipLevel: level });
  }
  if (status === "birthday") {
    return server.EVENT.put("/vip-bonus/claim-birthday-bonus");
  }
  if (status === "retain") {
    return server.EVENT.post("/vip-bonus/claim-first-retain?_method=PUT", { vipLevel: level });
  }
  if (status === "monthly") {
    return server.EVENT.put("/vip-bonus/claim-monthly-bonus");
  }
  if (status === "yearlyRetain") {
    return server.EVENT.post("/vip-bonus/claim-yearly-retain?_method=PUT", { vipLevel: level });
  }
  if (status === "coupon") {
    return server.EVENT.put("/vip-bonus/claim-coupon");
  }
  if (status === "redPacket") {
    return server.EVENT.put("/vip-bonus/claim-red-packet");
  }
  if (status === "all") {
    return server.EVENT.put("/vip-bonus/claim-all");
  }
}

export function getQuestionnaireList() {
  return server.EVENT.get("/questionnaire/list");
}

export function getQuestionnaireAns() {
  return server.EVENT.get("/questionnaire/answers");
}

export const submitQuestionnaire = (formData) => {
  const requestOptions = {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      token: `${userStore().token}`,
      "Content-Type": "application/json"
    }
  };
  var evtUrl = process.env.VUE_APP_EVT_API.split(",")[0];

  return fetch(evtUrl + "/questionnaire/submit", requestOptions)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export function initDepositRedPacket(item) {
  return server.EVENT.get(`/session/redPacketVip/initDepositRedPacket?promoCode=${item}`);
}

export function initNextRainTime(item) {
  return server.EVENT.get(`/session/redPacketVip/nextRainTime?promoCode=${item}`);
}

export function claimDailyRainItem(item) {
  return server.EVENT.get(`/redPacketVip/claim?promoCode=${item}`);
}
export function getDailyRainListing(item) {
  return server.EVENT.get(`/redPacketVip/list?promoCode=${item}`);
}
export function loadSummon(promoCode) {
  return server.EVENT.get("/member-summon/get-record", {
    params: {
      promoCode
    }
  });
}
export function claimSummon(promoCode) {
  return server.EVENT.post("/member-summon/claim", { promoCode });
}

export function loadAffiliateByDomain(host) {
  return server.REST.get(`/app/getAffiliateCode?siteCode=lh1&domain=${host}`);
}

export function getSummonRewardRecord(page) {
  return server.EVENT.get("/member-summon/get-summon-reward-record", {
    param: {
      page
    }
  });
}

export function getLOLMsiMatchRecord() {
  return server.EVENT.get("/game-match/upcoming/MSI");
}

export function getSportMatch() {
  return server.EVENT.get("/sport-match/today");
}

export function getLplSummer24Match() {
  return server.EVENT.get("game-match/upcoming/MSI");
}

export function duanwuVipUpgrade() {
  return server.EVENT.post("/duan-wu/vip-upgrade");
}

export function duanwuDepositBet() {
  return server.EVENT.post("/duan-wu/deposit-bet");
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

export function putNewUserAccumulateDepositClaim(ruleAmount, type) {
  return server.EVENT.put(`/new-user-accumulate-deposit/claim?ruleAmount=${ruleAmount}&type=${type}`, {});
}

export function initUefaCheckin() {
  return server.EVENT.get("/lh-uefa-check-in/init");
}
export function claimUefaCheckin() {
  return server.EVENT.put("/lh-uefa-check-in/claim");
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

export function getCheckInFreeTreasureInit() {
  return server.EVENT.get("/checkInFreeTreasure/init");
}

export function putCheckInFreeTreasureCheckIn(checkInDay) {
  return server.EVENT.put(`/checkInFreeTreasure/checkIn?checkInDay=${checkInDay}`, {});
}

export function putCheckInFreeTreasureClaim(point) {
  return server.EVENT.put(`/checkInFreeTreasure/claimTreasure?point=${point}`, {});
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

export function footballEligibility() {
  return server.EVENT.get("/session/lh1-football/eligibility");
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

export function getPglTreasureInit() {
  return server.EVENT.get("/session/pglTreasure/init");
}

export function putPglTreasureInit() {
  return server.EVENT.put("/session/pglTreasure/claim");
}
export function claimNBABonus(matchId) {
  return server.EVENT.post(`/session/nba-match-preseason/claim?matchId=${matchId}`);
}

export function getIEMRioInit() {
  return server.EVENT.get("/session/iem-rio/init");
}
export function claimIEMRioBonus() {
  return server.EVENT.post("/session/iem-rio/claimBonus");
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

export function getBelgradeInit(promoCode) {
  return server.EVENT.get("/session/bb-dacha-belgrade/init", { promoCode });
}
export function claimBelgradeBonus(promoCode) {
  return server.EVENT.post("/session/bb-dacha-belgrade/claimBonus", { promoCode });
}

export function getYallaCompassInit() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return server.EVENT.get(`/session/competition-bet-deposit/init?promoCode=lh1-yalla-compass&v=${randNum}`);
}
export function claimYallaCompassBonus() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return server.EVENT.post(`/session/competition-bet-deposit/claimBonus?promoCode=lh1-yalla-compass&v=${randNum}`);
}
export function getElisaGiftInit() {
  // return server.EVENT.get("/session/elisa-gift/init");
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return server.EVENT.get(`/session/competition-bet-deposit/init?promoCode=lh1-yalla-compass&v=${randNum}`);
}
export function claimElisaGiftBonus() {
  // return server.EVENT.post("/session/elisa-gift/claimBonus");
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return server.EVENT.post(`/session/competition-bet-deposit/claimBonus?promoCode=lh1-yalla-compass&v=${randNum}`);
}

export function getGlobalTreasureDetail(promoCode) {
  return server.EVENT.get(`/session/treasure-key/init`, {
    params: {
      promoCode
    }
  });
}

export function openGlobalTreasure(promoCode, treasure) {
  return server.EVENT.post(`/session/treasure-key/claimBonus`, { promoCode, treasure });
}

export function getGlobalCheckInRecord(promoCode) {
  return server.EVENT.get(`/session/treasure-key/init-check-in`, {
    params: {
      promoCode
    }
  });
}

export function getGlobalOpenRecord(promoCode, page) {
  console.log(page);
  return server.EVENT.get(`/session/treasure-key/treasure-record`, {
    params: {
      promoCode: promoCode,
      size: page.size,
      current: page.current
    }
  });
}

export function getGlobalKeyRecord(promoCode, page) {
  return server.EVENT.get(`/session/treasure-key/key-record`, {
    params: {
      promoCode: promoCode,
      size: page.size,
      current: page.current
    }
  });
}

export function claimGlobalCheckInTreasure(promoCode, day) {
  return server.EVENT.post(`/session/treasure-key/claimCheckIn`, { promoCode, day });
}

export function getGameTypeBonusInit(promoCode) {
  return server.EVENT.get("/session/game-type-bonus/init", {
    params: {
      promoCode
    }
  });
}

export function claimGameTypeBonus(promoCode) {
  return server.EVENT.post("/session/game-type-bonus/claim", { promoCode });
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

export function getCompetitionLossInit(promoCode) {
  return server.EVENT.get("/session/competition-loss/init", {
    params: {
      promoCode
    }
  });
}

export function claimCompetitionLoss(promoCode) {
  return server.EVENT.post("/session/competition-loss/claim", { promoCode });
}

export function getWeeklySlotLossBonusInit() {
  return server.EVENT.get("/session/weeklySlotLossBonus/init");
}

export function claimWeeklySlotLossBonusInit() {
  return server.EVENT.put("/bonus/claim/lh1-weekly-slot-loss-bonus");
}

export function initDrawEvent(promoCode) {
  return server.EVENT.get(`/session/draw-event/init?promoCode=${promoCode}`);
}

export function getDrawPrizes(promoCode, drawTimes) {
  return server.EVENT.post(`/session/draw-event/draw?promoCode=${promoCode}&drawTimes=${drawTimes}`);
}

// export const getDrawPrizes = (promoCode, drawTimes) => {
//   const requestOptions = {
//     method: "POST",
//     headers: {
//       token: `${userStore().token}`,
//       "Content-Type": "application/json"
//     }
//   };
//   var evtUrl = process.env.VUE_APP_EVT_API.split(",")[0];

//   return fetch(evtUrl + `/session/draw-event/draw?promoCode=${promoCode}&drawTimes=${drawTimes}`, requestOptions)
//     .then((response) => {
//       return response.json();
//     })
//     .catch((error) => {
//       return Promise.reject(error);
//     });
// };
export function getDrawRecord(promoCode, params) {
  return server.EVENT.get(
    `/session/draw-event/record?promoCode=${promoCode}&size=${params.size}&current=${params.current}`
  );
}

export function getLatestClaimedBonusList(promoCode) {
  return server.EVENT.get(`/session/draw-event/getLatestClaimedBonusList?promoCode=${promoCode}`);
}

export function getBountyInit(promoCode) {
  return server.EVENT.get(`/session/event-check-in/can-claim?promoCode=${promoCode}`);
}
export function claimBountyBonus(promoCode) {
  return server.EVENT.post(`/session/event-check-in/claim?promoCode=${promoCode}`);
}

export function getCompetitionBetPlatformInit(promoCode) {
  return server.EVENT.get(`/session/competition-bet-platform/init?promoCode=${promoCode}`);
}

export function getCompetitionBetPlatformClaimBonus(promoCode) {
  return server.EVENT.post(`/session/competition-bet-platform/claimBonus?promoCode=${promoCode}`);
}
export function getVctcnInit(promoCode) {
  return server.EVENT.get(`/session/competition-bet-platform/init?promoCode=${promoCode}`);
}
export function claimVctcnBonus(promoCode) {
  return server.EVENT.post(`/session/competition-bet-platform/claimBonus?promoCode=${promoCode}`);
}
export function getBelgrade2025Init(promoCode) {
  return server.EVENT.get(`/session/competition-single-bet/init?promoCode=${promoCode}`);
}
export function getVctBangkokInit(promoCode) {
  return server.EVENT.get(`/session/competition/yesterday?promoCode=${promoCode}`);
}
export function claimBelgrade2025Bonus(promoCode) {
  return server.EVENT.post(`/session/competition-single-bet/claimBonus?promoCode=${promoCode}`);
}
export function claimVctBangkokBonus(promoCode) {
  return server.EVENT.post(`/session/competition/claimBonus?promoCode=${promoCode}`);
}

export function getCompetitionLossWeeklyInit(promoCode) {
  return server.EVENT.get(`/session/competition-loss-weekly/init?promoCode=${promoCode}`);
}
export function claimCompetitionLossWeekly(promoCode) {
  return server.EVENT.post(`/session/competition-loss-weekly/claim?promoCode=${promoCode}`);
}

export function getPGLOnFireBuenosAires2025(promoCode) {
  return server.EVENT.get(`/session/competition/yesterday?promoCode=${promoCode}`);
}
export function claimPGLOnFireBuenosAires2025(promoCode) {
  return server.EVENT.post(`/session/competition/claimBonus?promoCode=${promoCode}`);
}

export function getSkyesportsSouvenir2025Bonus(promoCode) {
  return server.EVENT.get(`/session/competition-payout-deposit/init?promoCode=${promoCode}`);
}
export function claimSkyesportsSouvenir2025Bonus(promoCode) {
  return server.EVENT.post(`/session/competition-payout-deposit/claimBonus?promoCode=${promoCode}`);
}

export function initLanternFestivalBonus(promoCode) {
  return server.EVENT.get(`/session/valid-bet-bonus/init?promoCode=${promoCode}`);
}

export function claimLanternFestivalBonus(promoCode) {
  return server.EVENT.post("/session/valid-bet-bonus/claimBonus", { promoCode });
}

export function initLanternFestivalDeposit(promoCode) {
  return server.EVENT.get(`/session/lantern-festival/init?promoCode=${promoCode}`);
}

export function claimLanternFestivalDeposit(promoCode) {
  return server.EVENT.post("/session/lantern-festival/claimBonus", { promoCode });
}

export function getPGLBucharest2025Bonus(promoCode) {
  return server.EVENT.get(`/session/competition/yesterday?promoCode=${promoCode}`);
}
export function claimPGLBucharest2025Bonus(promoCode) {
  return server.EVENT.post(`/session/competition/claimBonus?promoCode=${promoCode}`);
}

export function getFissureUniverseS4Bonus(promoCode) {
  return server.EVENT.get(`/session/competition/yesterday?promoCode=${promoCode}`);
}
export function claimFissureUniverseS4Bonus(promoCode) {
  return server.EVENT.post(`/session/competition/claimBonus?promoCode=${promoCode}`);
}

export function getIemMelbourne2025Bonus(promoCode) {
  return server.EVENT.get(`/session/competition/yesterday?promoCode=${promoCode}`);
}
export function claimIemMelbourne2025Bonus(promoCode) {
  return server.EVENT.post(`/session/competition/claimBonus?promoCode=${promoCode}`);
}

export function getPglWallachiaS4Bonus(promoCode) {
  return server.EVENT.get(`/session/competition/yesterday?promoCode=${promoCode}`);
}
export function claimPglWallachiaS4Bonus(promoCode) {
  return server.EVENT.post(`/session/competition/claimBonus?promoCode=${promoCode}`);
}
export function getMesaInit() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return server.EVENT.get(`/session/competition/yesterday?promoCode=lh1-mesa-nomadic-masters-spring-2025&v=${randNum}`);
}
export function claimMesaBonus() {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return server.EVENT.post(
    `/session/competition/claimBonus?promoCode=lh1-mesa-nomadic-masters-spring-2025&v=${randNum}`
  );
}
export function getBlastRival2025Bonus(promoCode) {
  return server.EVENT.get(`/session/competition-loss/init?promoCode=${promoCode}`);
}
export function claimBlastRival2025Bonus(promoCode) {
  return server.EVENT.post(`/session/competition-loss/claim?promoCode=${promoCode}`);
}
export function getIemDallas2025Bonus(promoCode) {
  return server.EVENT.get(`/session/competition/yesterday?promoCode=${promoCode}`);
}
export function claimIemDallas2025Bonus(promoCode) {
  return server.EVENT.post(`/session/competition/claimBonus?promoCode=${promoCode}`);
}

export function getDreamLeagueS26Bonus(promoCode) {
  return server.EVENT.get(`/session/competition/yesterday?promoCode=${promoCode}`);
}
export function claimDreamLeagueS26Bonus(promoCode) {
  return server.EVENT.post(`/session/competition/claimBonus?promoCode=${promoCode}`);
}

export function getDuanWuRewardInit(promoCode) {
  return server.EVENT.get(`/session/token-rewards/init?promoCode=${promoCode}`);
}

export function getDuanWuTokenRecords(promoCode) {
  return server.EVENT.get(`/session/token-rewards/tokenRecords?promoCode=${promoCode}`);
}

export function getDuanWuRewardRecords(promoCode) {
  return server.EVENT.get(`/session/token-rewards/rewardRecords?promoCode=${promoCode}`);
}

export function postDuanWuReceiveToken(promoCode) {
  return server.EVENT.post(`/session/token-rewards/receiveToken?promoCode=${promoCode}`);
}

export function getDuanWuclaimBonus(promoCode) {
  return server.EVENT.post(`/session/token-rewards/claimBonus?promoCode=${promoCode}`);
}

export function initBlastAustin(promoCode) {
  return server.EVENT.get(`/session/mission/init?promoCode=${promoCode}`);
}

export function selectMissionBlastAustin(promoCode) {
  return server.EVENT.post(`/session/mission/select?promoCode=${promoCode}`);
}

export function claimChestBlastAustin(promoCode, type) {
  return server.EVENT.post(`/session/mission/claim?promoCode=${promoCode}&type=${type}`);
}
