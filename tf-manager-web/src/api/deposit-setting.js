import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const createDepositSetting = (depositSetting) => {
  return https().request("/depositSetting", Method.POST, depositSetting, ContentType.form);
};

export const updateDepositSetting = (depositSetting) => {
  return https().request(`/depositSetting/${depositSetting.id}?_method=PUT`, Method.POST, depositSetting, ContentType.form);
};

export const getDepositSetting = (depositSetting) => {
  return https().request("/depositSetting", Method.GET, depositSetting, ContentType.form);
};
