import { Method } from "axios-mapper";
import https from "../utils/https";

export const getSite = (id) => {
  return https().request(`/site/${id}`, Method.GET);
};
