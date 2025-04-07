import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getList = (query) => {
  return https().request("/member-adjust-event", Method.GET, query, ContentType.form);
};
