import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getBankCardList = (bank) => {
  for (const key in bank) {
    if (bank[key] === null || bank[key] === undefined || bank[key] === "") {
      delete bank[key];
    }
  }
  return https().request("/system-bank-card", Method.GET, bank, ContentType.form);
};

export const createBankCard = (bank) => {
  return https().request("/system-bank-card", Method.POST, bank, ContentType.post);
};

export const updateBankCard = (bank) => {
  return https().request(`/system-bank-card?_method=PUT`, Method.POST, bank, ContentType.post);
};

export const updateBankCardStatus = async (id, status) => {
  await https().request(`/system-bank-card/${id}/status?_method=PUT`, Method.POST, { status: status }, ContentType.form);
};

export const deleteBankCard = async (ids) => {
  await https().request(`/system-bank-card?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const checkUniqueIdentityCode = (code) => {
  return https().request("/system-bank-card/checkUnique", Method.POST, {
    identityCode:
      code
  }, ContentType.form);
};

export const getWithdrawBankCard = (id) => {
  return https().request("/system-bank-card/withdrawList", Method.GET, { id: id });
};

export const getAllWithdrawBankCard = () => {
  return https().request("/system-bank-card/allWithdrawList", Method.GET);
};
