import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getSiteWithdrawPlatform = (siteId) => {
  return https().request("/site-withdraw-platform", Method.GET, { siteId: siteId }, ContentType.form);
};

// export const insertSiteWithdrawPlatform = (siteWithdrawPlatform) => {
//   return https().request("/site-withdraw-platform", Method.POST, siteWithdrawPlatform, ContentType.json);
// };

export const insertSiteWithdrawPlatform = async (id, siteWithdrawPlatform) => {
  await https().request(`/site-withdraw-platform/${id}?_method=POST`, Method.POST, { platformIds: siteWithdrawPlatform }, ContentType.form);
};
