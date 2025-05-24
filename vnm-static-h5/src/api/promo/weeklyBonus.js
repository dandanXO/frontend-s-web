import { eventapi } from "src/boot/axios";
import qs from "qs";

export const weeklyBonusInit = (promoCode) => {
  return eventapi.get("session/weekly-deposit/init", { params: { promoCode: promoCode } });
};

export const claimWeeklyBonus = (promoCode) => {
  return eventapi.post("session/weekly-deposit/claimBonus", qs.stringify({ promoCode }));
};
