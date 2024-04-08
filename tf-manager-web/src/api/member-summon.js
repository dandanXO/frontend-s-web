import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const listMemberSummonRewardRecord = (form) => {
  return https().request("/member-summon-reward-record", Method.GET, form, ContentType.form);
};
