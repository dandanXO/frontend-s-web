import { server } from "@/utils/request";
import { userStore } from "@/store";
import cached from "@/utils/cache";

export function loadPromo(siteType) {
  return server.REST.get("/opt-session/promo/page", { params: { siteType } });
}

export function loadPromoBanner(category) {
  return server.REST.get("/opt-session/promo/banner", {
    params: {
      category: category
    }
  });
}

export function loadHomePopup(siteType) {
  return server.REST.get("/member/ads-popout", { params: { siteType } });
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

export function submitLuckyNumber(item, promoCode) {
  return server.EVENT.post(`/privi/lotteryNumber`, {
    number: item,
    promoCode: promoCode
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

export function submitGameStep() {
  return server.EVENT.post(`/game-steps/step`);
}

export function getStepRecords(current) {
  return server.EVENT.get(`/game-steps/records`, {
    params: {
      size: 10,
      current: current
    }
  });
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
export function canRedeemWelcome() {
  return server.EVENT.get("/vip-welcome/canRedeem");
}
export function canRedeemMonthly(promoCode) {
  return server.EVENT.get(`/privi/vip/canRedeem?promoCode=${promoCode}`);
}

export function claim(level) {
  return server.EVENT.post("/vip-upgrade/lh/claim", { vipLevel: level });
}
export function claimMonthly() {
  return server.EVENT.put("/bonus/claim/vnm-vip-monthly");
}
export function claimWelcome(level) {
  return server.EVENT.post("/vip-welcome/claim", { vipLevel: level });
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

// penny bank
export function piggyBankGetLottery() {
  return server.EVENT.post(`session/piggy-bank/getLotteryByPromoCode?promoCode=vnm-piggy-bank-sport`);
}

export function piggyBankClaimOther() {
  return server.EVENT.put(`session/piggy-bank/claimByPromoCode?promoCode=vnm-piggy-bank-other`);
}

export function piggyBankClaimSport() {
  return server.EVENT.put(`session/piggy-bank/claimByPromoCode?promoCode=vnm-piggy-bank-sport`);
}

export function getBonusPiggyCashback() {
  return server.EVENT.get("/piggy-bank/amount");
}

// slot netloss
export function bonusClaimSlotsRefund() {
  return server.EVENT.put("/bonus/claim/vnm-slots-refund");
}
export function getBonusSlotsCashback() {
  return server.EVENT.get("/vnm-refund/slots");
}

// tf88 baoheimvon
export function gettT88Detail(promoCode) {
  return server.EVENT.get("/lose-refund/get-ytd-loss", {
    params: {
      promoCode
    }
  });
}
export function claimT88Reward(promoCode) {
  return server.EVENT.post("/lose-refund/claim", { promoCode });
}

// poker cashback
export function bonusClaimPokerRefund() {
  return server.EVENT.put("/bonus/claim/vnm-poker-refund");
}
export function getBonusPokerCashback() {
  return server.EVENT.get("/vnm-refund/poker");
}
export function selectNumber(promoCode, number) {
  return server.EVENT.post("/uefa-lottery/select-number", { promoCode, number });
  // const formData = {
  //   promoCode: promoCode,
  //   number: Number(number)
  // }
  // const requestOptions = {
  //   method: 'POST',
  //   body: JSON.stringify(formData),
  //   headers: {
  //       token: `${userStore().token}`,
  //       'Content-Type': 'application/json'
  //   },
  // };
  //   var evtUrl = process.env.VUE_APP_EVT_API.split(",")[0];

  // return fetch(evtUrl + '/uefa-lottery/select-number', requestOptions)
  //   .then(response => {
  //     return response.json()
  //   })
  //   .catch(error => {
  //     return Promise.reject(error);
  //   });
}
export function getSelectedNumber() {
  return server.EVENT.get("/uefa-lottery/selected-number");
}
export function getWinners(promoCode) {
  return server.EVENT.get(`/uefa-lottery/winners?promoCode=${promoCode}`);
}
export function getPrizeAmount(promoCode) {
  return server.EVENT.get(`/uefa-lottery/get-prize-amount?promoCode=${promoCode}`);
}
export function loadPromoTypes(siteType) {
  return cached.get("PROMOTION_TYPES", () => server.REST.get(`/promo/type`));
}

export function initDrawEvent(promoCode) {
  return server.EVENT.get(`/session/draw-event/init?promoCode=${promoCode}`);
}

export function getDrawPrizes(promoCode, drawTimes) {
    return server.EVENT.post(`/session/draw-event/draw?promoCode=${promoCode}&drawTimes=${drawTimes}`);
}

export function getDrawRecord(promoCode, params) {
  return server.EVENT.get(`/session/draw-event/record?promoCode=${promoCode}&size=${params.size}&current=${params.current}`);
}

