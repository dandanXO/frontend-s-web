import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getBlacknWhitelist = (blanknWhitelist) => {
  return https().request("/refer-friend-bnw-list", Method.GET, blanknWhitelist, ContentType.form);
};

export const createBlacknWhitelist = (blanknWhitelist) => {
  return https().request("/refer-friend-bnw-list", Method.POST, blanknWhitelist, ContentType.form);
};

export const createBatchBlacknWhitelist = (blanknWhitelist, siteId) => {
  return https(5 * 60 * 1000).request("/refer-friend-bnw-list/createBatch", Method.POST, { bnwList: JSON.stringify(blanknWhitelist), siteId: siteId }, ContentType.form);
};

export const deleteBlacknWhitelist = (ids) => {
  return https().request(`/refer-friend-bnw-list?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
