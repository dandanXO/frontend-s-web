import { server } from "@/utils/request";
export function getSlotLucky8(promoCode) {
  return server.EVENT.get(`/lucky-slot/bets?promoCode=${promoCode}`);
}

export function submitSlotLucky8(promoCode, id) {
  return server.EVENT.get(`/lucky-slot/claim?promoCode=${promoCode}&luckySlotId=${id}`);
}