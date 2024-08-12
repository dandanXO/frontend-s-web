import { server } from "@/utils/request";

export const getNewPlayerMission = () => {
  return server.EVENT.get("newbie-mission/history");
};

export const submitNewPlayerMission = (promoCode) => {
  return server.EVENT.post("newbie-mission/submit", { promoCode });
};
