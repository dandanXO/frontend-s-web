import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getGameStepsSettings = (siteId) => {
  return https().request("/game-steps", Method.GET, { siteId: siteId }, ContentType.form);
};

export const getGameStepsStages = (siteId) => {
  return https().request("/game-steps/stages", Method.GET, { siteId: siteId }, ContentType.form);
};

export const createGameStepsSettings = (settings) => {
  return https().request('/game-steps', Method.POST, settings, ContentType.form);
};

export const updateGameStepsParam = (siteId, param) => {
  return https().request('/game-steps/param?_method=PUT', Method.POST, { siteId: siteId, param: param }, ContentType.form);
};

export const updateGameStepsSettings = (settings) => {
  return https().request('/game-steps/?_method=PUT', Method.POST, settings, ContentType.form);
};

export const getGameStepsRecords = (gameSteps) => {
  return https().request("/game-steps/records", Method.GET, gameSteps, ContentType.form);
};

export const getGameStepsRecordsForExport = (gameSteps) => {
  return https().request("/game-steps/export", Method.GET, gameSteps, ContentType.form);
};

export const getSiteWithPromo = () => {
  return https().request("/game-steps/sites", Method.GET);
}

export const getNextLevel = (siteId) => {
  return https().request("/game-steps/nextLevel", Method.GET, { siteId: siteId }, ContentType.form);
};

export const deleteGameStepsSettings = (id) => {
  return https().request(`/game-steps/${id}?_method=DELETE`, Method.POST);
};
