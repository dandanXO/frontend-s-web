import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getMemberRiskInfo = (id, queryValue, pageable) => {
  return https().request(`/member/${id}/${queryValue}`, Method.GET, pageable, ContentType.form);
};
