import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getSystemMessageTemplate = (systemMessageTemplate) => {
  return https().request("/site-pm", Method.GET, systemMessageTemplate, ContentType.form);
};

export const getMemberMessage = (memberMessage) => {
  return https().request("/site-pm/member-message", Method.GET, memberMessage, ContentType.form);
};

export const createSystemMessageTemplate = (systemMessageTemplate) => {
  return https().request("/site-pm", Method.POST, systemMessageTemplate, ContentType.json);
};

export const updateSystemMessageTemplate = (systemMessageTemplate) => {
  return https().request("/site-pm?_method=PUT", Method.POST, systemMessageTemplate, ContentType.json);
};

export const replyMember = (systemMessageTemplate) => {
  return https().request("/site-pm/reply", Method.POST, systemMessageTemplate, ContentType.json);
};

export const deleteMessageTemplate = async (siteId, ids) => {
  await https().request(`/site-pm?_method=DELETE`, Method.POST, { siteId: siteId, ids: ids.join(",") }, ContentType.form);
};

export const createBatchMessageTemplate = (messages) => {
  return https(5 * 60 * 1000).request("/site-pm/createBatch", Method.POST, { messages: JSON.stringify(messages) }, ContentType.form);
};
