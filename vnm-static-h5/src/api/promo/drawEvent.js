import { eventapi } from "src/boot/axios";
import qs from "qs";

export const drawEventInit = (promoCode) => {
  return eventapi.get("session/draw-event/init", { params: { promoCode: promoCode } });
};

export const claimDrawEvent = (promoCode) => {
  return eventapi.post("session/draw-event/draw", qs.stringify({ promoCode }));
};
