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

export const getRedirectMember = (query) => {
  return https().request("/redirect/member", Method.GET, query, ContentType.form);
};

export const exportRedirectMember = (query) => {
  return https().request("/redirect/member/exportRedirectMember", Method.GET, query, ContentType.form);
};

export const importRedirectMember = (redirectMembers) => {
  return https(5 * 60 * 1000).request("/redirect/member/importRedirectMember", Method.POST, { redirectMembers: JSON.stringify(redirectMembers) }, ContentType.form);
};

export const getRedirectExcelMapping = (siteId) => {
  return https().request("/redirect/excelMapping", Method.GET, { siteId: siteId }, ContentType.form);
};

export const deleteRedirectMember = (id, siteId) => {
  return https().request(`/redirect/member/${id}?_method=DELETE`, Method.POST, { siteId: siteId }, ContentType.form);
};
