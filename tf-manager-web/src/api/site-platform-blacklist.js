import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getSitePlatformBlacklist = (game) => {
  return https().request("/sitePlatformBlacklist", Method.GET, game, ContentType.form);
};

export const createSitePlatformBlacklist = (game) => {
  return https().request("/sitePlatformBlacklist", Method.POST, game, ContentType.form);
};

export const updateSitePlatformBlacklist = async (game) => {
  await https().request(`/sitePlatformBlacklist/${game.id}?_method=PUT`, Method.POST, game, ContentType.form);
};

export const deleteSitePlatformBlacklist = async (ids) => {
  await https().request(`/sitePlatformBlacklist?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const getExport = (data) => {
  return https().request("/sitePlatformBlacklist/export", Method.GET, data, ContentType.form);
};

export const preCheckForCreate = (memberMainInfo) => {
  return https().request("/member-edit-log/check", Method.POST, memberMainInfo, ContentType.json);
};
