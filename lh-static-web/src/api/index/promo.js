import { server } from "@/utils/request";
import { userStore } from "@/store";

export function loadPromo() {
  const store = userStore();

  const platformApiUrl = store.token ? "/session/loggedInPromoPages" : "/promo/page";

  return server.REST.get(platformApiUrl);
}

export function loadPromoBanner(category) {
  return server.REST.get("/promo/banner", {
    params: {
      category: category
    }
  });
}

export function loadHomePopup() {
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

export function canRedeem() {
  return server.EVENT.get("/vip-upgrade/lh/canRedeem");
}
export function claim(level) {
  return server.EVENT.post("/vip-upgrade/lh/claim", { vipLevel: level });
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

export function putNewUserAccumulateDepositClaim(ruleAmount) {
  return server.EVENT.put(`/new-user-accumulate-deposit/claim?ruleAmount=${ruleAmount}`, {});
}

export function initUefaCheckin() {
  return server.EVENT.get("/lh-uefa-check-in/init");
}
export function claimUefaCheckin() {
  return server.EVENT.put("/lh-uefa-check-in/claim");
}

export function getOlympicFirstDeposit() {
  return server.EVENT.get('/lhOlympicDailyFirstDeposit/init')
}

export function claimOlympicFirstDeposit() {
  return server.EVENT.put('/lhOlympicDailyFirstDeposit/claim')
}

export function getOlympicDailySportBet() {
  return server.EVENT.get('/lhOlympicDailySportBet/init')
}

export function claimOlympicDailySportBet() {
  return server.EVENT.put('/lhOlympicDailySportBet/claim')
}
