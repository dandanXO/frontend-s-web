import { Method } from "axios-mapper";
import https from "../utils/https";

export const getAffiliateDomain = (id) => {
  return https().request(`/affiliate-domain/${id}`, Method.GET);
};
