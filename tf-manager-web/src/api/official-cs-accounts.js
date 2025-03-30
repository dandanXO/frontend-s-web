import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getCsAccounts = (siteId) => {
  return https().request("/official-cs-accounts", Method.GET, { siteId: siteId }, ContentType.form);
};

export const updateAccounts = (siteId, accounts) => {
  return https().request(`/official-cs-accounts?_method=PUT`, Method.POST, { siteId: siteId, csAccounts: accounts }, ContentType.form);
};
