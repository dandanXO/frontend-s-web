import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getDomainTypes = () => {
  return https().request("/system-domain-access/domainTypes", Method.GET, ContentType.form);
};

export const getDomainAccessList = (query) => {
  return https().request("/system-domain-access", Method.GET, query, ContentType.form);
};

export const createDomainAccess = (domain) => {
  return https().request(`/system-domain-access`, Method.POST, domain, ContentType.form);
};

export const updateDomainAccess = (domain) => {
  return https().request(`/system-domain-access?_method=PUT`, Method.POST, domain, ContentType.form);
};

export const deleteDomainAccess = async (ids) => {
  await https().request(`/system-domain-access?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
