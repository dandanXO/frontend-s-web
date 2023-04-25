import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getEmails = (game) => {
  return https().request("/site-email", Method.GET, game, ContentType.form);
};
export const createEmail = (email) => {
  return https().request("/site-email", Method.POST, email, ContentType.form);
};

export const updateEmail = async (email) => {
  await https().request(`/site-email/${email.id}?_method=PUT`, Method.POST, email, ContentType.form);
};

export const deleteEmail = async (ids) => {
  await https().request(`/site-email?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const createBatchEmail = (emails) => {
  return https(5 * 60 * 1000).request("/site-email/createBatch", Method.POST, { emails: JSON.stringify(emails) }, ContentType.form);
};
