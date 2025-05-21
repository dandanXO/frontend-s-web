import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getSensitiveWord = (request) => {
  return https().request(
    '/live-sport/sensitive-word',
    Method.GET,
    request,
    ContentType.form
  )
};

export const addSensitiveWord = (request) => {
  return https().request("/live-sport/sensitive-word/add", Method.POST, request, ContentType.form);
};

export const updateSensitiveWord = (request) => {
  return https().request(`/live-sport/sensitive-word/update`, Method.POST, request, ContentType.form);
};

export const deleteSensitiveWord = (request) => {
  return https().request(`/live-sport/sensitive-word/delete`, Method.POST, request, ContentType.form);
};
