import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getGameStepsParam = (siteId) => {
  return https().request("/game-steps", Method.GET, { siteId: siteId }, ContentType.form);
};

export const updateGameStepsParam = (siteId, param) => {
  return https().request(`/game-steps?_method=PUT`, Method.POST, { siteId: siteId, param: param }, ContentType.form);
};

export const getGameStepsRecords = (gameSteps) => {
  return https().request("/game-steps/records", Method.GET, gameSteps, ContentType.form);
};

export const getSiteWithPromo = () => {
  return https().request("/game-steps/sites", Method.GET);
}

export const getGameStepsRecordsForExport = (gameSteps) => {
  return https().request("/game-steps/export", Method.GET, gameSteps, ContentType.form);
};
