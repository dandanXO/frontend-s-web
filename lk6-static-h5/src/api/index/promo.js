import { cached } from "boot/cache";
import { api, eventapi } from "boot/axios";

const qs = require("qs");

export const initSportWeeklyBonus = (params) => {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/game-type-bonus/init?promoCode=lk6-sport-weekly-bonus&randNum=${randNum}`);
};

export const claimSportWeeklyBonus = (params) => {
  return eventapi.post(`/session/game-type-bonus/claim?promoCode=lk6-sport-weekly-bonus`);
};

export const initHappySaturdayBonus = () => {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/session/weekly-bet/init?promoCode=lk6-happy-saturday&randNum=${randNum}`);
};

export const claimHappySaturdayBonus = () => {
  return eventapi.post(`/session/weekly-bet/claimBonus?promoCode=lk6-happy-saturday`);
};
