import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getSitePlatforms = (sitePlatform) => {
  return https().request("/sitePlatform", Method.GET, sitePlatform, ContentType.form);
};

export const createSitePlatform = (sitePlatform) => {
  return https().request("/sitePlatform", Method.POST, sitePlatform, ContentType.form);
};

export const updateSitePlatform = async (sitePlatform) => {
  await https().request(`/sitePlatform/${sitePlatform.id}?_method=PUT`, Method.POST, sitePlatform, ContentType.form);
};

export const deleteSitePlatform = async (ids) => {
  await https().request(`/sitePlatform?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const updateSitePlatformShowTransfer = async (id, showTransfer) => {
  await https().request(`/system-platform-account/${id}/showTransfer?_method=PUT`, Method.POST, { showTransfer: showTransfer }, ContentType.form);
};

export const getSitePlatformList = (sitePlatform) => {
  return https().request("/sitePlatform/list", Method.GET, sitePlatform, ContentType.form);
};

export const updateStatus = (id, state) => {
  return https().request(`/sitePlatform/${id}/state?_method=PUT`, Method.POST, { state: state }, ContentType.form);
};
