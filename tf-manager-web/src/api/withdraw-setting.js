import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getWithdrawSettings = (withdrawSetting) => {
  return https().request("/withdrawSetting", Method.GET, withdrawSetting, ContentType.form);
};

export const createWithdrawSetting = (withdrawSetting) => {
  return https().request("/withdrawSetting", Method.POST, withdrawSetting, ContentType.form);
};

export const updateWithdrawSetting = async (withdrawSetting) => {
  await https().request(`/withdrawSetting/${withdrawSetting.id}?_method=PUT`, Method.POST, withdrawSetting, ContentType.form);
};

export const getWithdrawSettingList = (withdrawSetting) => {
  return https().request("/withdrawSetting/list", Method.GET, withdrawSetting, ContentType.form);
};

export const insertOrUpdate = (withdrawSetting) => {
  return https().request("/withdrawSetting/insertOrUpdate", Method.POST, { withdrawSetting: JSON.stringify(withdrawSetting) }, ContentType.form);
};
