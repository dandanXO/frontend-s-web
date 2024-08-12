import { server } from "@/utils/request";

export function getMatchAndPrizeInfo() {
  return server.EVENT.get("/privi/memberSlotBetInfo");
}

export function getPrizeMoney() {
    return server.EVENT.put("/bonus/claim/xf1-slots-bet-bonus");
}