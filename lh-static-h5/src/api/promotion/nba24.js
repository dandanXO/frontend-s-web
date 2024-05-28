import { eventapi } from "boot/axios";

const qs = require("qs");
export function getNbaMatch() {
  return eventapi.get("/nba-match/upcoming");
}

export function getNbaRecord() {
  return eventapi.get("/nba-match/history");
}

export function submitNbaMatch(params) {
  return eventapi.post("/nba-match/submit", qs.stringify(params));
}
