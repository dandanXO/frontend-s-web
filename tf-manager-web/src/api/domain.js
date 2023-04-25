import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getDomains = (id) => {
  return https().request(`/domain/${id}`, Method.GET, {}, ContentType.form);
};

export const createDomain = (domain) => {
  return https().request("/domain", Method.POST, domain, ContentType.form);
};

export const updateDomain = async (id, domain) => {
  await https().request(`/domain/${id}/domain?_method=PUT`, Method.POST, { domain: domain }, ContentType.form);
};
