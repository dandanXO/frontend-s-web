import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getGameMatch = (query) => {
  return https().request("/game-match", Method.GET, query, ContentType.form);
};

export const createGameMatch = (gameMatch) => {
  return https().request("/game-match", Method.POST, gameMatch, ContentType.form);
};

export const updateGameMatch = (id) => {
  return https().request(`/game-match/${id}?_method=PUT`, Method.POST);
};
