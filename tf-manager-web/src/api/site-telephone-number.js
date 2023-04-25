import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getTelephones = (game) => {
  return https().request("/site-telephone-number", Method.GET, game, ContentType.form);
};
export const createTelephone = (telephone) => {
  return https().request("/site-telephone-number", Method.POST, telephone, ContentType.form);
};

export const updateTelephone = async (telephone) => {
  await https().request(`/site-telephone-number/${telephone.id}?_method=PUT`, Method.POST, telephone, ContentType.form);
};

export const deleteTelephone = async (ids) => {
  await https().request(`/site-telephone-number?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const createBatchTelephone = (telephones) => {
  return https(5 * 60 * 1000).request("/site-telephone-number/createBatch", Method.POST, { telephoneNumbers: JSON.stringify(telephones) }, ContentType.form);
};
