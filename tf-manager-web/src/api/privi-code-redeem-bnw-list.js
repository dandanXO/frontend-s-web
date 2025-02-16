import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getBlacknWhitelist = (blanknWhitelist) => {
  return https().request("/privi-code-redeem-bnw", Method.GET, blanknWhitelist, ContentType.form);
};

export const createBlacknWhitelist = (blanknWhitelist) => {
  return https().request("/privi-code-redeem-bnw", Method.POST, blanknWhitelist, ContentType.form);
};

export const createBatchBlacknWhitelist = (blanknWhitelist) => {
  return https(5 * 60 * 1000).request("/privi-code-redeem-bnw/createBatch", Method.POST, { bnwList: JSON.stringify(blanknWhitelist) }, ContentType.form);
};

export const deleteBlacknWhitelist = (ids) => {
  return https().request(`/privi-code-redeem-bnw?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const getPromoCodeExcelMapping = (siteId) => {
  return https().request("/privi-code-redeem-bnw/excelMapping", Method.GET, { siteId: siteId }, ContentType.form);
};
