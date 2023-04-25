import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getWithdrawTips = (siteId) => {
  return https().request("/withdrawTips", Method.GET, { siteId: siteId }, ContentType.form);
};

export const updateWithdrawTips = (withdrawTips) => {
  return https().request(`/withdrawTips?_method=PUT`, Method.POST, withdrawTips, ContentType.form);
};
