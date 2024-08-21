import { eventapi } from "boot/axios";

export function getMatchAndPrizeInfo(type) {
  return eventapi.get(`/privi/memberSlotBetInfo?type=${type}`);
}

export function getPrizeMoney(promoCode) {
  return eventapi.put(`/bonus/claim/${promoCode}`);
}
