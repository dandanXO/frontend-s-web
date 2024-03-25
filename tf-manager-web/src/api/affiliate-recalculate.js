import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getJobs = (query) => {
  return https().request("/affiliate-recalculate/query", Method.GET, query, ContentType.form);
};

export const addJob = (job) => {
  return https().request("/affiliate-recalculate/add", Method.POST, job, ContentType.form);
};
