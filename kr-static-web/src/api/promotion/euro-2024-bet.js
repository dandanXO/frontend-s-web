import { server } from "@/utils/request";

export function getBetDetail(promoCode) {
  return server.EVENT.get("/event-bet-reward/get-bet-detail", { params: { promoCode: promoCode } });
}

export function claimSummon(promoCode) {
  return server.EVENT.post("/event-bet-reward/claim", {
    promoCode: promoCode
  });
}
