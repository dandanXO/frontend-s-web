import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getMessageOutbox = (systemMessageTemplate) => {
  return https().request("/message-outbox", Method.GET, systemMessageTemplate, ContentType.form);
};

export const deleteMessageOutbox = async (ids) => {
  await https().request(`/message-outbox?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
