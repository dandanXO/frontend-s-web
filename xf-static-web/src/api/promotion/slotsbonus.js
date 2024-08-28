import { server } from "@/utils/request";

export function getMatchAndPrizeInfo(type) {
  return server.EVENT.get(`/privi/memberSlotBetInfo?type=${type}`);
}

export function getPrizeMoney(promoCode) {
  return server.EVENT.put(`/bonus/claim/${promoCode}`);
}
