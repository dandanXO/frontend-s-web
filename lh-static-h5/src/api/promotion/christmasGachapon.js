import { eventapi } from "boot/axios";

export function initDrawEvent(promoCode) {
  return eventapi.get(`/session/draw-event/init?promoCode=${promoCode}`);
}

export function getDrawPrizes(promoCode, drawTimes) {
    return eventapi.post(`/session/draw-event/draw?promoCode=${promoCode}&drawTimes=${drawTimes} `);
}

export function getDrawRecord(promoCode, params) {
  return eventapi.get(`/session/draw-event/record?promoCode=${promoCode}&size=${params.size}&current=${params.current}`);
}

