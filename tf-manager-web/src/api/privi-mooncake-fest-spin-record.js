import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const mooncakeFestSpinRecordList = (form) => {
  return https().request("/mooncake-fest-spin-record", Method.GET, form, ContentType.form);
};
