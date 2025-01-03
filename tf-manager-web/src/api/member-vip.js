import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getMemberVip = (members) => {
  return https().request("/member-vip", Method.POST, members, ContentType.form);
};

export const getMemberVipExport = (members) => {
  return https().request("/member-vip", Method.GET, members, ContentType.form);
};

export const getVipUpgradeRecord = (query) => {
  return https().request("/member-vip-upgrade", Method.GET, query, ContentType.form);
};
