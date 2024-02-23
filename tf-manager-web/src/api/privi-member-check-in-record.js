import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const listMemberCheckInRecord = (form) => {
  return https().request("/privi-member-check-in", Method.GET, form, ContentType.form);
};
