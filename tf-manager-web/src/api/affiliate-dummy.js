import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getDummyRecords = (query) => {
  return https().request("/affiliate-dummy", Method.GET, query, ContentType.form);
};

export const getPlatformDummyRecords = (query) => {
  return https().request("/affiliate-dummy/platformDetails", Method.GET, query, ContentType.form);
};

export const createDummyRecord = (dummy) => {
  return https().request("/affiliate-dummy", Method.POST, dummy, ContentType.form);
};

export const updateDummyRecord = (dummy) => {
  return https().request('/affiliate-dummy?_method=PUT', Method.POST, dummy, ContentType.form);
};

export const deleteDummyRecord = (records) => {
  return https().request(`/affiliate-dummy?_method=DELETE`, Method.POST, records, ContentType.form);
};
