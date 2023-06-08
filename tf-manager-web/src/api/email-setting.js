import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getEmailSetting = (setting) => {
  return https().request("/emailSetting", Method.GET, setting, ContentType.form);
};

export const createEmailSetting = (setting) => {
  return https().request("/emailSetting", Method.POST, setting, ContentType.form);
};

export const updateEmailSetting = (setting) => {
  return https().request(`/emailSetting/${setting.id}?_method=PUT`, Method.POST, setting, ContentType.form);
};

export const deleteEmailSetting = async (ids) => {
  await https().request(`/emailSetting?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
