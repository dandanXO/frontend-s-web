import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getPlatformsWc = (platform) => {
  return https().request("/platformWc", Method.GET, platform, ContentType.form);
};

export const createPlatformWc = (platform) => {
  return https().request("/platformWc", Method.POST, platform, ContentType.form);
};

export const updatePlatformWc = async (platform) => {
  await https().request(`/platformWc/${platform.id}?_method=PUT`, Method.POST, platform, ContentType.form);
};

export const deletePlatformWc = async (ids) => {
  await https().request(`/platformWc?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
