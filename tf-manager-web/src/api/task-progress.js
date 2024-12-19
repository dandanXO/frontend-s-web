import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getMemberTaskProgress = (taskProgress) => {
  return https().request("/task-progress", Method.GET, taskProgress, ContentType.form);
};
