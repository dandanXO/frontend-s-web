import { eventapi } from "boot/axios";

export function getMatchAndPrizeInfo() {
  return eventapi.get("/lpl-lck");
}

export function getPrizeMoney() {
    return eventapi.put("/bonus/claim/dy2-lpl-lck-bonus");
}


