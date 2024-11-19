import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getDomains = (id) => {
  return https().request(`/domain/${id}`, Method.GET, {}, ContentType.form);
};

export const getDomainTypes = () => {
  return https().request(`/site-domain/types`, Method.GET);
};

export const createDomain = (domain) => {
  return https().request("/domain", Method.POST, domain, ContentType.form);
};

export const updateDomain = async (id, domain) => {
  await https().request(`/domain/${id}/domain?_method=PUT`, Method.POST, { domain: domain }, ContentType.form);
};

export const getSiteDomains = (query) => {
  return https().request(`/site-domain`, Method.GET, query, ContentType.form);
};

export const createSiteDomain = (domain) => {
  return https().request("/site-domain", Method.POST, domain, ContentType.form);
};

export const updateSiteDomain = (domain) => {
  return https().request(`/site-domain?_method=PUT`, Method.POST, domain, ContentType.form);
};

export const deleteSiteDomain = async ids => {
  await https().request(
    `/site-domain?_method=DELETE`,
    Method.POST,
    { ids: ids.join(',') },
    ContentType.form
  )
}
