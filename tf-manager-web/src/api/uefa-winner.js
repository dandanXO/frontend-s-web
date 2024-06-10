import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getUefaWinner = (query) => {
  return https().request("/uefa-winner", Method.GET, query, ContentType.form);
};

export const createUefaWinner = (winner) => {
  return https().request("/uefa-winner", Method.POST, winner, ContentType.form);
};

export const updateUefaWinner = (id, winner) => {
  return https().request(`/uefa-winner/${id}?_method=PUT`, Method.POST, winner, ContentType.form);
};

export const deleteUefaWinner = (ids) => {
  return https().request(`/uefa-winner?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
