import { server } from "@/utils/request";

export function getMatchAndPrizeInfo() {
  return server.EVENT.get("/privi/memberSlotBetInfo");
}

export function getPrizeMoney(promoCode) {
  return server.EVENT.put(`/bonus/claim/${promoCode}`);
}
