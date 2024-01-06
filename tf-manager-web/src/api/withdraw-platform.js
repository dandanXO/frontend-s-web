import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getWithdrawPlatforms = (withdrawPlatform) => {
  return https().request("/withdrawPlatform", Method.GET, withdrawPlatform, ContentType.form);
};

export const createWithdrawPlatform = (withdrawPlatform) => {
  return https().request("/withdrawPlatform", Method.POST, withdrawPlatform, ContentType.form);
};

export const updateWithdrawPlatform = async (withdrawPlatform) => {
  await https().request(`/withdrawPlatform/${withdrawPlatform.id}?_method=PUT`, Method.POST, withdrawPlatform, ContentType.form);
};

export const updateWithdrawPlatformStatus = (id, status) => {
  return https().request(`/withdrawPlatform/${id}/status?_method=PUT`, Method.POST, { status: status }, ContentType.form);
};

export const copyWithdrawPlatform = async (withdrawPlatform) => {
  await https().request(`/withdrawPlatform/copy?_method=PUT`, Method.POST, withdrawPlatform, ContentType.form);
};
