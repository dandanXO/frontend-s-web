import { eventapi } from "src/boot/axios";
import qs from "qs";

export const getNewPlayerMission = () => {
  return eventapi.get("newbie-mission/history");
};

export const submitNewPlayerMission = (promoCode) => {
  return eventapi.post("newbie-mission/submit", qs.stringify({ promoCode }));
};
