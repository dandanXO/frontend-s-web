import { eventapi } from "boot/axios";

export function getSlotLucky8(promoCode) {
  return eventapi.get(`/lucky-slot/bets?promoCode=${promoCode}`);
}

export function submitSlotLucky8(promoCode, id) {
  return eventapi.get(`/lucky-slot/claim?promoCode=${promoCode}&luckySlotId=${id}`);
}
