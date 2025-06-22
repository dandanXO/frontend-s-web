import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getLiveMatchMars = (params) => {
  return https().request("/live-match-mars", Method.GET, params, ContentType.form);
};

export const addToLive = (params) => {
  return https().request("/live-match-mars/add-to-live", Method.POST, params, ContentType.form);
};

export const refreshToGetLiveUrl = async (id) => {
  return https().request("/live-match-mars/refresh/" + id, Method.GET, id, ContentType.form);
};

export const deleteLiveMatchMars = (ids) => {
  return https().request(`/live-match-mars?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
