import { getToken } from "@/utils/cookies";

export const state = {
  token: getToken() || "",
  name: "",
  permissions: null,
  userType: "",
  siteId: null,
  siteName: "",
  avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
};
