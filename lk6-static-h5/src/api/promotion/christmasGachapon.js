import { eventapi } from "boot/axios";

export function initDrawEvent(promoCode) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/draw-event/init?promoCode=${promoCode}&v=${randNum}`);
}

export function getDrawPrizes(promoCode, drawTimes) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
    return eventapi.post(`/session/draw-event/draw?promoCode=${promoCode}&drawTimes=${drawTimes}&v=${randNum}`);
}

export function getDrawRecord(promoCode, params) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/draw-event/record?promoCode=${promoCode}&size=${params.size}&current=${params.current}&v=${randNum}`);
}

