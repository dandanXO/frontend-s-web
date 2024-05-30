import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getRedirect = (query) => {
  return https().request("/redirect", Method.GET, query, ContentType.form);
};

export const createRedirect = (redirect) => {
  return https().request("/redirect", Method.POST, redirect, ContentType.form);
};

export const updateRedirect = (id, redirect) => {
  return https().request(`/redirect/${id}?_method=PUT`, Method.POST, redirect, ContentType.form);
};

export const updateRedirectStatus = (id, status) => {
  return https().request(`/redirect/${id}/status?_method=PUT`, Method.POST, { status: status }, ContentType.form);
};

export const deleteRedirect = (id) => {
  return https().request(`/redirect/${id}?_method=DELETE`, Method.POST);
};
