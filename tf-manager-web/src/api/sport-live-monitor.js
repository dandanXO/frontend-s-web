import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getLiveMonitorList = (body) => {
  return https().request(`/live-sport/monitor/query`, Method.POST, body, ContentType.json);
};

export const getLiveMonitorScores = (streamNames) => {
  const params = new URLSearchParams();
  streamNames.forEach(name => params.append('streamNames', name));

  return https().request(
    `/live-sport/monitor/score?${params.toString()}`,
    'GET'
  );
};
