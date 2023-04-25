import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getBankInfoList = (bank) => {
  for (const key in bank) {
    if (bank[key] === null || bank[key] === undefined || bank[key] === "") {
      delete bank[key];
    }
  }
  return https().request("/system-bank-info", Method.GET, bank, ContentType.form);
};

export const createBank = (bank) => {
  return https().request("/system-bank-info", Method.POST, bank, ContentType.post);
};

export const updateBank = (bank) => {
  return https().request(`/system-bank-info?_method=PUT`, Method.POST, bank, ContentType.post);
};

export const updateBankStatus = async (id, status) => {
  await https().request(`/system-bank-info/${id}/status?_method=PUT`, Method.POST, { status: status }, ContentType.form);
};

export const getBankInfoListSimple = () => {
  return https().request("/system-bank-info/bankInfoList", Method.GET);
}

export const deleteBank = async (ids) => {
  await https().request(`/system-bank-info?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
