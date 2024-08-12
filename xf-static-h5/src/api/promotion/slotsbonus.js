import { eventapi } from "boot/axios";

export function getMatchAndPrizeInfo() {
  return eventapi.get("/privi/memberSlotBetInfo");
}

export function getPrizeMoney(promoCode) {
  return eventapi.put(`/bonus/claim/${promoCode}`);
}
