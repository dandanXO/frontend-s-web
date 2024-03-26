import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getWithdrawBankList = (bank) => {
  return https().request("/system-withdraw-bank", Method.GET, bank, ContentType.form);
};

export const createWithdrawBank = (bank) => {
  return https().request("/system-withdraw-bank", Method.POST, bank, ContentType.json);
};

export const deleteWithdrawBank = (id) => {
  return https().request(`/system-withdraw-bank/${id}`, Method.DELETE);
};

export const getWithdrawPlatform = (bank) => {
  return https().request("/system-withdraw-bank/withdraw", Method.GET, bank, ContentType.form);
};

export const copyWithdrawBank = (withdrawNameCopyFrom, withdrawNameCopyTo) => {
  return https().request(`/system-withdraw-bank/duplicate`, Method.POST, { withdrawNameCopyFrom: withdrawNameCopyFrom, withdrawNameCopyTo: withdrawNameCopyTo }, ContentType.form);
};
