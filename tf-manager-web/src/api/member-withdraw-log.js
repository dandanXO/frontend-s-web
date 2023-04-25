import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getMemberWithdrawLog = (withdrawId) => {
  return https().request("/memberWithdrawLog/getMemberWithdrawLog", Method.GET, { withdrawId: withdrawId }, ContentType.form);
};

export const getAffiliateWithdrawLog = (withdrawId) => {
  return https().request("/memberWithdrawLog/getAffiliateWithdrawLog", Method.GET, { withdrawId: withdrawId }, ContentType.form);
};
