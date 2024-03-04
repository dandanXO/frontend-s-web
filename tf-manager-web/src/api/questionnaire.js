import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getQuestionnaire = (query) => {
  return https().request("/questionnaire", Method.GET, query, ContentType.form);
};

export const getQuestionnaireChoice = (id) => {
  return https().request(`/questionnaire/${id}/choice`, Method.GET);
};

export const createQuestionnaire = (questionnaire) => {
  return https().request("/questionnaire", Method.POST, questionnaire, ContentType.form);
};

export const updateQuestionnaire = (id, questionnaire) => {
  return https().request(`/questionnaire/${id}?_method=PUT`, Method.POST, questionnaire, ContentType.form);
};

export const updateQuestionnaireStatus = (id, status) => {
  return https().request(`/questionnaire/${id}/status?_method=PUT`, Method.POST, { status: status }, ContentType.form);
};

export const deleteQuestionnaire = (ids) => {
  return https().request(`/questionnaire?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const getQuestionnaireRecord = (query) => {
  return https().request("/member-questionnaire", Method.GET, query, ContentType.form);
};

export const getQuestionnaireRecordForExport = (query) => {
  return https().request("/member-questionnaire/export", Method.GET, query, ContentType.form);
};
