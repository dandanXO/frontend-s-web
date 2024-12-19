import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getTask = (task) => {
  return https().request("/task", Method.GET, task, ContentType.form);
};

export const createTask = (task) => {
  return https().request("/task", Method.POST, task, ContentType.form);
};

export const updateTask = (id, task) => {
  return https().request(`/task/${id}?_method=PUT`, Method.POST, task, ContentType.form);
};

export const updateTaskState = (id, siteId, state) => {
  return https().request(`/task/${id}/state?_method=PUT`, Method.POST, { siteId: siteId, state: state }, ContentType.form);
};

export const deleteTask = (ids) => {
  return https().request(`/task?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
