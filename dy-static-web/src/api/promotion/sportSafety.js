import { server } from "@/utils/request";

export function getUpcomingSportMatches() {
  return server.EVENT.get("/game-match/upcoming/SPORT");
}

export function getSportInsurancePlatformOptions() {
  return server.EVENT.get("/game-match/platform/SPORT");
}

export function submitSportInsuranceForm(params) {
  return server.EVENT.post("/game-match/submit", params);
}

export function getSportInsuranceRecords(gameType) {
  return server.EVENT.get(`/game-match/records/${gameType}`);
}
