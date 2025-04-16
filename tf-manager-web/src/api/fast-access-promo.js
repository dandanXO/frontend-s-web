import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getFastAccessPromo = (query) => {
  return https().request("/fast-access-promo", Method.GET, query, ContentType.form);
};

export const createFastAccessPromo = (rain) => {
  return https().request("/fast-access-promo/create", Method.POST, rain, ContentType.json);
};

export const updateFastAccessPromo = (rain) => {
  return https().request("/fast-access-promo/update?_method=PUT", Method.POST, rain, ContentType.json);
};

export const updateFastAccessState = async (id, state, siteId) => {
  await https().request(`/fast-access-promo/${id}/fastAccessState?_method=PUT`, Method.POST, { state: state, siteId: siteId }, ContentType.form);
};
