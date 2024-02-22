import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getBbDacha = (query) => {
  return https().request("/bb-dacha", Method.GET, query, ContentType.form);
};

export const createBbDacha = (bbDacha) => {
  return https().request("/bb-dacha", Method.POST, bbDacha, ContentType.form);
};

export const updateBbDacha = (id, bbDacha) => {
  return https().request(`/bb-dacha/${id}?_method=PUT`, Method.POST, bbDacha, ContentType.form);
};

export const updateToShow = (id) => {
  return https().request(`/bb-dacha/${id}/show?_method=PUT`, Method.POST, {}, ContentType.form);
};

export const endBbDacha = (id, bbDacha) => {
  return https().request(`/bb-dacha/${id}/end?_method=PUT`, Method.POST, bbDacha, ContentType.form);
};

export const cancelBbDacha = (id) => {
  return https().request(`/bb-dacha/${id}/cancel?_method=PUT`, Method.POST);
};

export const getBbDachaAnswers = (query) => {
  return https().request("/bb-dacha-answer", Method.GET, query, ContentType.form);
};

export const updateBbDachaAnswer = (id, status) => {
  return https().request(`/bb-dacha-answer/${id}?_method=PUT`, Method.POST, { status: status }, ContentType.form);
};

export const getBbDachaAnswersForExport = (query) => {
  return https().request("/bb-dacha-answer/export", Method.GET, query, ContentType.form);
};
