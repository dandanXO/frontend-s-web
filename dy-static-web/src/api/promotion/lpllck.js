import { server } from "@/utils/request";

export function getMatchAndPrizeInfo() {
  return server.EVENT.get("/lpl-lck");
}

export function getPrizeMoney() {
    return server.EVENT.put("/bonus/claim/dy2-lpl-lck-bonus");
}