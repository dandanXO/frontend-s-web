import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getAffiliateDomains = (pageable) => {
  return https().request("/affiliate-domain", Method.GET, pageable, ContentType.form);
};

export const createAffiliateDomain = async (affiliateDomain) => {
  return https().request("/affiliate-domain", Method.POST, affiliateDomain, ContentType.form);
};

export const delAffiliateDomain = (id) => {
  return https().request(`/affiliate-domain/${id}?_method=DELETE`, Method.POST);
};

export const delBatchAffiliateDomain = (ids) => {
  return https().request(`/affiliate-domain?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const updateAffiliateDomain = (affiliateDomain) => {
  return https().request(`/affiliate-domain/${affiliateDomain.id}?_method=PUT`, Method.POST, affiliateDomain, ContentType.form);
};
