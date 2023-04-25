import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getCurrencyrate = (currencyrate) => {
  for (const key in currencyrate) {
    if (currencyrate[key] === null || currencyrate[key] === undefined || currencyrate[key] === "") {
      delete currencyrate[key];
    }
  }
  return https().request("/currencyrate", Method.GET, currencyrate, ContentType.form);
};

export const createCurrencyrate = (currencyrate) => {
  for (const key in currencyrate) {
    if (currencyrate[key] === null || currencyrate[key] === undefined || currencyrate[key] === "") {
      delete currencyrate[key];
    }
  }
  return https().request("/currencyrate", Method.POST, currencyrate, ContentType.json);
};

export const updateCurrencyrate = async (currencyrate) => {
  await https().request(`/currencyrate/${currencyrate.id}?_method=PUT`, Method.POST, currencyrate, ContentType.form);
};

export const deleteCurrencyrate = async (ids) => {
  await https().request(`/currencyrate?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
