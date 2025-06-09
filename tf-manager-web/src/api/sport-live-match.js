import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getSportLiveMatch = (request) => {
  return https().request('/live-sport/match', Method.GET, request, ContentType.form);
};

export function copySportLiveMatch(query) {
  return https().request(
    '/live-sport/match',
    Method.POST,
    query,
    ContentType.json
  )
}

export const batchDeleteSportLiveMatch = ({ matchIds }) => {
  // 批量刪除比賽
  return https().request(
    `/live-sport/match/batch-delete`,
    Method.DELETE,
    { matchIds },
    ContentType.json
  );
};
