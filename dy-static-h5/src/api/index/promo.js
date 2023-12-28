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
