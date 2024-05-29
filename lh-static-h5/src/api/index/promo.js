import { cached } from "boot/cache";
import { eventapi } from "boot/axios";

const qs = require("qs");

export function claimBonusItem(item) {
  return cached.put(`/bonus/claim/${item}`);
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
      promoCode: "lh1-lottery"
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

export function getCurrentStepInit() {
  return eventapi.get(`/game-steps/initiate`, {});
}

export function submitGameStep(param) {
  const { stage } = param;
  return eventapi.post(
    `/game-steps/step`,
    qs.stringify({
      stage: stage
    })
  );
}

export function getStepRecords(current, currentStage) {
  return eventapi.get(`/game-steps/records?size=10&current=${current}&stage=${currentStage}`, {});
}

// 意见反馈
export function getTreasureDetail(promoCode) {
  return eventapi.get(`/event-treasure/get-treasure-detail/${promoCode}`);
}
export function getKeyCount(promoCode) {
  return eventapi.get(`/event-treasure/get-key`, {
    params: {
      promoCode
    }
  });
}
export function getOpenRecord(promoCode, page) {
  console.log(page);
  return eventapi.get(`/event-treasure/get-open-record/${promoCode}`, {
    size: page.size,
    current: page.current
  });
}

export function getKeyRecord(promoCode, page) {
  return eventapi.get(`/event-treasure/get-key-record/${promoCode}`, {
    size: page.size,
    current: page.current
  });
}

export function openTreasure(promoCode, treasureLevel) {
  return eventapi.post(`/event-treasure/open`, qs.stringify({ promoCode, treasureLevel }));
}

export function getCheckInRecord(promoCode) {
  return eventapi.get(`/event-check-in/get-record`, {
    params: {
      promoCode
    }
  });
}

export function claimCheckInTreasure(promoCode, days) {
  return eventapi.post(`/event-check-in/open`, qs.stringify({ promoCode, days }));
}

export function getLOLMsiMatchRecord() {
  return eventapi.get("/game-match/upcoming/MSI");
}

export function getEurocupManualSchedule() {
  return eventapi.get("/uefa/match/all");
}

export function getSportMatch() {
  return eventapi.get('/sport-match/today')
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
