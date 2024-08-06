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

export function submitPiggyBankLottery() {
  return eventapi.post(`/piggy-bank/getLottery`);
}

export function submitPiggyBankClaim() {
  return eventapi.put(`/piggy-bank/claim`);
}

export function getPiggyBankAmt() {
  return eventapi.get(`/piggy-bank/amount`);
}

export function submitLuckyNumber(item) {
  return eventapi.post(
    `/privi/lotteryNumber`,
    qs.stringify({
      number: item,
      promoCode: "vnm-iphone"
    })
  );
}

export function submitNewLossBonus(item) {
  return eventapi.post(`/privi/lotteryNumber`);
}

export function submitPokerNewLossBonus() {
  return eventapi.put(`/bonus/claim/ka2-poker-refund`);
}

export function refundPokerBonus() {
  return eventapi.get(`ka2-refund/poker`);
}

export function submitSlotNewLossBonus() {
  return eventapi.put(`/bonus/claim/ka2-slots-refund`);
}

export function refundSlotBonus() {
  return eventapi.get(`ka2-refund/slots`);
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

export function submitGameStep() {
  return eventapi.post(`/game-steps/step`);
}

export function getStepRecords(current) {
  return eventapi.get(`/game-steps/records?size=10&current=${current}`, {});
}

export function selectNumber(promoCode, number) {
  return eventapi.post('/uefa-lottery/select-number',
    qs.stringify({
      number: number,
      promoCode: promoCode
    }));
}
export function getSelectedNumber() {
  return eventapi.get('/uefa-lottery/selected-number')
}
export function getWinners(promoCode) {
  return eventapi.get(`/uefa-lottery/winners?promoCode=${promoCode}`);
}
export function getPrizeAmount(promoCode) {
  return eventapi.get(`/uefa-lottery/get-prize-amount?promoCode=${promoCode}`);
}

export function getBetDetail(promoCode) {
  return eventapi.get("/event-bet-reward/get-bet-detail", { params: { promoCode: promoCode } });
}

export function claimSummon(promoCode) {
  return eventapi.post(
    "/event-bet-reward/claim",
    qs.stringify({
      promoCode: promoCode
    })
  );
}
