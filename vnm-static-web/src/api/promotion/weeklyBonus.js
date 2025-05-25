import { server } from "@/utils/request";

export const weeklyBonusInit = (promoCode) => {
  return server.EVENT.get("session/weekly-deposit/init", { params: { promoCode: promoCode } });
};

export const claimWeeklyBonus = (promoCode) => {
  return server.EVENT.post("/session/weekly-deposit/claimBonus", { promoCode });
};
