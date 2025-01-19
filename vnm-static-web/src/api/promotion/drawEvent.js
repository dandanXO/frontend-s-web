import { server } from "@/utils/request";

export const drawEventInit = (promoCode) => {
  return server.EVENT.get("session/draw-event/init", { params: { promoCode: promoCode } });
};

export const claimDrawEvent = (promoCode) => {
  return server.EVENT.post("session/draw-event/draw", { promoCode });
};
