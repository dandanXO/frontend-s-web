import { getToken, getId, getSiteId, getSiteCode, getLoginName, getRealName, getAffiliateLevel } from "@/utils/cookies";

export const state = {
  token: getToken() || "",
  name: getLoginName() || "",
  realName: getRealName() || "",
  permissions: null,
  userType: "",
  avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
  id: getId() || "",
  siteId: getSiteId() || "",
  siteCode: getSiteCode() || "",
  affiliateLevel: getAffiliateLevel() || ""
};
