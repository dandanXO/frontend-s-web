import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getVipUpgradeList = (query) => {
  return https().request("/vip-upgrade", Method.GET, query, ContentType.form);
};
