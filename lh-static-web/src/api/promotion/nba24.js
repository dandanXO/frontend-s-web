import { server } from "@/utils/request";
export function getNbaMatch() {
  return server.EVENT.get("/nba-match/upcoming");
}

export function getNbaRecord() {
  return server.EVENT.get("/nba-match/history");
}

export function submitNbaMatch(params) {

  return server.EVENT.post("/nba-match/submit", params);
}
