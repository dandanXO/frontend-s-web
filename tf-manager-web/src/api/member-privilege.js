import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const distributePrivilege = (privilege) => {
  return https().request("/member-privilege/distribute", Method.POST, privilege, ContentType.form);
};
