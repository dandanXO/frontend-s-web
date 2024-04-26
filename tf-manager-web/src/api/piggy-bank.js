import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getPiggyBankSettings = (siteId) => {
  return https().request("/piggy-bank/settings", Method.GET, { siteId: siteId }, ContentType.form);
};

export const updatePiggyBankSettings = (siteId, param) => {
  return https().request(`/piggy-bank?_method=PUT`, Method.POST, { siteId: siteId, param: param }, ContentType.form);
};

export const getPiggyBankRecords = (piggyBank) => {
  return https().request("/piggy-bank", Method.GET, piggyBank, ContentType.form);
};

export const getSiteWithPromo = () => {
  return https().request("/piggy-bank/sites", Method.GET);
}
