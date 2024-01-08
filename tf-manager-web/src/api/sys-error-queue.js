import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getErrorQueue = (request) => {
  return https().request("/error", Method.GET, request, ContentType.form);
};

export const resendErrors = async (ids) => {
  await https().request(`/error`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const deleteErrors = async (ids) => {
  await https().request(`/error?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
