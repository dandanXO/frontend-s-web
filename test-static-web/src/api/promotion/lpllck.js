import { server } from "@/utils/request";

export function getMatchAndPrizeInfo() {
  return server.EVENT.get("/lpl-lck");
}

export function getPrizeMoney() {
    return server.EVENT.put("/bonus/claim/lh1-lpl-lck-bonus");
}