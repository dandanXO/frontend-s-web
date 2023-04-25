import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getWithdrawalBankBlacklist = (withdrawalBankBlacklist) => {
  return https().request("/withdrawalBankBlacklist", Method.GET, withdrawalBankBlacklist, ContentType.form);
};

export const createWithdrawalBankBlacklist = (withdrawalBankBlacklist) => {
  return https().request("/withdrawalBankBlacklist", Method.POST, withdrawalBankBlacklist, ContentType.form);
};

export const deleteWithdrawalBankBlacklist = (ids) => {
  return https().request(`/withdrawalBankBlacklist?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
