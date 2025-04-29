import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getAnalysisRecord = (form) => {
  return https().request("/refer-friend-analysis", Method.GET, form, ContentType.form);
};

export const getMemberReferRecordRelation = (form) => {
  return https().request("/refer-friend-analysis/relation", Method.GET, form, ContentType.form);
};

export const getAnalysisRecordExport = (form) => {
  return https().request("/refer-friend-analysis/bulk-refer-friend-analysis-export", Method.GET, form, ContentType.form);
};
