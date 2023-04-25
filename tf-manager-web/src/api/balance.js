import https from "@/utils/https";
import { Method } from "axios-mapper";

export const getBalance = () => {
  return https().request("/memberWithdrawRecord/withdrawPlatformBalance", Method.GET);
};
