import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getMemberVip = (members) => {
  return https().request("/member-vip", Method.GET, members, ContentType.form);
};
