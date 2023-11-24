import { cached } from "boot/cache";
import { eventapi } from "boot/axios";

export function claimBonusItem(item) {
  return cached.put(`/bonus/claim/${item}`);
}

export function getSportMatchQuizInfo() {
  return eventapi.get(`/quiz/upcoming`, {});
}

export function getMemberSportMatchRecord() {
  return eventapi.get(`/quiz/answeredRecords`, {});
}

export function submitMemberSportMatchQuiz(param) {
  const { quizId, quizTitle, answerOne, answerTwo, answerThree } = param;
  return eventapi.post(`/quiz/submit`, {
    quizId,
    quizTitle,
    answerOne,
    answerTwo,
    answerThree
  });
}

export function submitLuckyNumber(item) {
  return eventapi.post(`/privi/lotteryNumber`, {
    number: item,
    promoCode: "dy2-lottery"
  });
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
