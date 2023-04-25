import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getAllJob = (query) => {
  return https().request("/jobs", Method.GET, query, ContentType.form);
};

export const createJob = (jobInfo) => {
  return https().request("/jobs", Method.POST, jobInfo, ContentType.form);
};

export const updateJob = async (jobInfo) => {
  await https().request(`/jobs/${jobInfo.id}?_method=PUT`, Method.POST, jobInfo, ContentType.form);
};

export const deleteJob = async (ids) => {
  await https().request(`/jobs?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const stopJob = async (id) => {
  await https().request(`/jobs/${id}/state?_method=PUT`, Method.POST, { state: 0 }, ContentType.form);
};

export const runJob = async (id) => {
  await https().request(`/jobs/${id}/state?_method=PUT`, Method.POST, { state: 1 }, ContentType.form);
};
