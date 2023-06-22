import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getBalance = (siteId) => {
  return https().request("/memberWithdrawRecord/withdrawPlatformBalance", Method.GET, { siteId: siteId }, ContentType.form);
};
