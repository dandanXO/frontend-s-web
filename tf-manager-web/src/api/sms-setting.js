import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getSmsSetting = (setting) => {
  return https().request("/smsSetting", Method.GET, setting, ContentType.form);
};

export const createSmsSetting = (setting) => {
  return https().request("/smsSetting", Method.POST, setting, ContentType.form);
};

export const updateSmsSetting = (setting) => {
  return https().request(`/smsSetting/${setting.id}?_method=PUT`, Method.POST, setting, ContentType.form);
};

export const deleteSmsSetting = async (ids) => {
  await https().request(`/smsSetting?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
