import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getAffiliateFBRequests = (pageable) => {
  return https().request("/affiliate-fb-request", Method.GET, pageable, ContentType.form);
};

export const createAffiliateFBRequest = async (affiliateFBRequest) => {
  return https().request("/affiliate-fb-request", Method.POST, affiliateFBRequest, ContentType.form);
};

export const delAffiliateFBRequest = (id) => {
  return https().request(`/affiliate-fb-request/${id}?_method=DELETE`, Method.POST);
};

export const delBatchAffiliateFBRequest = (ids) => {
  return https().request(`/affiliate-fb-request?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const updateAffiliateFBRequest = (affiliateFBRequest) => {
  return https().request(`/affiliate-fb-request/${affiliateFBRequest.id}?_method=PUT`, Method.POST, affiliateFBRequest, ContentType.form);
};
