import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getSmsList = (smsList) => {
  return https().request("/member-sms", Method.GET, smsList, ContentType.form);
};
