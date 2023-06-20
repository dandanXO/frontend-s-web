import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getSystemMessageTemplate = (systemMessageTemplate) => {
  return https().request("/system-message-template", Method.GET, systemMessageTemplate, ContentType.form);
};

export const createSystemMessageTemplate = (systemMessageTemplate) => {
  return https().request("/system-message-template", Method.POST, systemMessageTemplate, ContentType.json);
};

export const deleteMessageTemplate = async (ids) => {
  await https().request(`/system-message-template?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const createBatchMessageTemplate = (messages) => {
  return https(5 * 60 * 1000).request("/system-message-template/createBatch", Method.POST, { messages: JSON.stringify(messages) }, ContentType.form);
};
