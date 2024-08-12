import { eventapi } from "boot/axios";

export function getMatchAndPrizeInfo() {
  return eventapi.get("/privi/memberSlotBetInfo");
}

export function getPrizeMoney() {
    return eventapi.put("/bonus/claim/xf1-slots-bet-bonus");
}


