import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getMemberWithdrawLog = (withdrawId, wd) => {
  return https().request("/memberWithdrawLog/getMemberWithdrawLog", Method.GET, { withdrawId: withdrawId, withdrawDate: wd }, ContentType.form);
};

export const getAffiliateWithdrawLog = (withdrawId, wd) => {
  return https().request("/memberWithdrawLog/getAffiliateWithdrawLog", Method.GET, { withdrawId: withdrawId, withdrawDate: wd }, ContentType.form);
};
