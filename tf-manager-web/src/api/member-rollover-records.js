import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getMemberRolloverRecords = (rollover) => {
  return https().request("/rolloverRecord", Method.GET, rollover, ContentType.form);
};

export const getTotal = (rollover) => {
  return https().request("/rolloverRecord/total", Method.GET, rollover, ContentType.form);
};

export const cancelRollover = (rollover) => {
  return https().request("/rolloverRecord/cancel?_method=PUT", Method.POST, rollover, ContentType.form);
}
