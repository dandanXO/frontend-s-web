import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getCurrencies = (currency) => {
  for (const key in currency) {
    if (currency[key] === null || currency[key] === undefined || currency[key] === "") {
      delete currency[key];
    }
  }
  return https().request("/currency", Method.GET, currency, ContentType.form);
};

export const createCurrency = (currency) => {
  for (const key in currency) {
    if (currency[key] === null || currency[key] === undefined || currency[key] === "") {
      delete currency[key];
    }
  }
  return https().request("/currency", Method.POST, currency, ContentType.json);
};

export const updateCurrency = async (currency) => {
  await https().request(`/currency/${currency.id}?_method=PUT`, Method.POST, currency, ContentType.form);
};

export const deleteCurrency = async (ids) => {
  await https().request(`/currency?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const getCurrencyNames = () => {
  return https().request("/currency/simple", Method.GET);
};

export const getCurrencyCodes = () => {
  return https().request("/currency/simple", Method.GET);
};
