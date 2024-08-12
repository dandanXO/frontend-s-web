import { eventapi } from "src/boot/axios";

export const getNewPlayerMission = () => {
  return eventapi.get("newbie-mission/history");
};

export const submitNewPlayerMission = (promoCode) => {
  return eventapi.post("newbie-mission/submit", { promoCode });
};
