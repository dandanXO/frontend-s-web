import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getMemberStatistics = (siteCode) => {
  return https().request("/member/getMemberStatistics", Method.POST, siteCode, ContentType.form);
};
