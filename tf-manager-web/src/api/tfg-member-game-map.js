import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getGames = (game) => {
  return https().request("/tfgMemberGameMap", Method.GET, game, ContentType.form);
};

export const createGame = (game) => {
  return https().request("/tfgMemberGameMap", Method.POST, game, ContentType.form);
};

export const updateGame = async (game) => {
  await https().request(`/tfgMemberGameMap/${game.siteId}?_method=PUT`, Method.POST, game, ContentType.form);
};

export const deleteGame = async (siteId, loginNames) => {
  await https().request(`/tfgMemberGameMap?_method=DELETE`, Method.POST, { siteId, loginNames: loginNames.join(",") }, ContentType.form);
};

export const createBatchGame = (games) => {
  return https(5 * 60 * 1000).request("/tfgMemberGameMap/createBatch", Method.POST, { tfgMemberGameMap: JSON.stringify(games) }, ContentType.form);
};

export const getExport = (data) => {
  return https().request("/tfgMemberGameMap/export", Method.GET, data, ContentType.form);
};

export const preCheckForCreate = (memberMainInfo) => {
  return https().request("/member-edit-log/check", Method.POST, memberMainInfo, ContentType.json);
};
