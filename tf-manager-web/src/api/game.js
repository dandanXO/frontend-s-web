import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getGames = (game) => {
  return https().request("/game", Method.GET, game, ContentType.form);
};

export const createGame = (game) => {
  return https().request("/game", Method.POST, game, ContentType.form);
};

export const updateGame = async (game) => {
  await https().request(`/game/${game.id}?_method=PUT`, Method.POST, game, ContentType.form);
};

export const updateGameState = (id, state) => {
  return https().request(`/game/${id}/state?_method=PUT`, Method.POST, { state: state }, ContentType.form);
};

export const deleteGame = async (ids) => {
  await https().request(`/game?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const getGameTypes = () => {
  return https().request("/game/gameTypes", Method.GET);
};

export const getDevices = () => {
  return https().request("/game/devices", Method.GET);
};

export const createBatchGame = (games) => {
  return https(5 * 60 * 1000).request("/game/createBatch", Method.POST, { platformGames: JSON.stringify(games) }, ContentType.form);
};

export const getExport = (data) => {
  return https().request("/game/gameExport", Method.GET, data, ContentType.form);
};

export const getTagGames = (game) => {
  return https().request("/game/queryTagGame", Method.GET, game, ContentType.form);
};

export const createTagGames = (game) => {
  return https().request("/game/createTagGame", Method.POST, game, ContentType.form);
};

export const deleteTagGame = async (ids) => {
  await https().request(`/game/deleteTagGame?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const getGamesList = (game) => {
  return https().request("/game/queryGameListBySiteAndPlatform", Method.GET, game, ContentType.form);
};

export const updateTagGame = async (game) => {
  await https().request(`/game/updateTagGame/${game.id}?_method=PUT`, Method.POST, game, ContentType.form);
};

export const getExportTagGame = (data) => {
  return https().request("/game/tagGameExport", Method.GET, data, ContentType.form);
};
