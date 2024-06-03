import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getMemberReferRecord = (form) => {
  return https().request("/refer-friend/rebate", Method.GET, form, ContentType.form);
};

export const getMemberReferRewardRecord = (form) => {
  return https().request("/refer-friend-reward", Method.GET, form, ContentType.form);
};
