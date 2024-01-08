import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getAffiliateTagList = (id) => {
  return https().request(`/affiliateTag/${id}`, Method.GET);
};

export const createAffiliateTag = (id, description) => {
  return https().request(`/affiliateTag`, Method.POST, { affiliateId: id, description: description }, ContentType.form);
};

export const editAffiliateTag = (id, affiliateId, description) => {
  return https().request("/affiliateTag?_method=PUT", Method.POST, { id, affiliateId, description }, ContentType.form);
};

export const deleteAffiliateTag = (id) => {
  return https().request(`/affiliateTag/?_method=DELETE`, Method.POST, { id }, ContentType.form);
};
