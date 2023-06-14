import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getMemberRiskInfo = (id, site, queryValue, pageable) => {
  return https().request(`/member/${id}/${queryValue}/${site}`, Method.GET, pageable, ContentType.form);
};
