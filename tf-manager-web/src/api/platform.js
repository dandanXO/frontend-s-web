import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getPlatforms = (platform) => {
  return https().request("/platform", Method.GET, platform, ContentType.form);
};

export const getPlatformNames = () => {
  return https().request("/platform/name", Method.GET);
};

export const createPlatform = (platform) => {
  return https().request("/platform", Method.POST, platform, ContentType.form);
};

export const updatePlatform = async (platform) => {
  await https().request(`/platform/${platform.id}?_method=PUT`, Method.POST, platform, ContentType.form);
};

export const deletePlatform = async (ids) => {
  await https().request(`/platform?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const getPlatformExcelMapping = () => {
  return https().request("/platform/excelMapping", Method.GET);
};

export const getPlatformsBySite = (siteId) => {
  return https().request("/platform/sitePlatforms", Method.GET, { siteId: siteId }, ContentType.form);
};

export const getPlatformsBySiteAndGameType = (siteId, gameType) => {
  return https().request("/platform/siteAndGameType", Method.GET, { siteId: siteId, gameType: gameType }, ContentType.form);
};
