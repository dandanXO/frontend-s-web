import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getReferFriendEligibility = (query) => {
  return https().request("/refer-friend-eligibility", Method.GET, query, ContentType.form);
};

export const getReferFriendEligibilityDetails = (query) => {
  return https().request("/refer-friend-eligibility/details", Method.GET, query, ContentType.form);
};

export const checkHasClaimed = (query) => {
  return https().request("/refer-friend-eligibility/hasClaimed", Method.GET, query, ContentType.form);
};

export const distributeReferFriendEligibility = (query) => {
  return https().request("/refer-friend-eligibility/distribute", Method.POST, query, ContentType.form);
}

export const getExport = (query) => {
  return https().request("/refer-friend-eligibility/export", Method.GET, query, ContentType.form);
};
