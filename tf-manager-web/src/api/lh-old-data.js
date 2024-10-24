import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const queryOldData = (loginName) => {
  return https().request("/lh-old-data", Method.GET, { loginName: loginName }, ContentType.form);
};
