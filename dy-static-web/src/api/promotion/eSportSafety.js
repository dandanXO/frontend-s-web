import { server } from "@/utils/request";

export function getUpcomingESportMatches() {
  return server.EVENT.get("/game-match/upcoming/ESPORT");
}

export function getESportInsurancePlatformOptions() {
  return server.EVENT.get("/game-match/platform/ESPORT");
}

export function submitESportInsuranceForm(params) {
  return server.EVENT.post("/game-match/submit", params);
}

export function getESportInsuranceRecords(params) {
  return server.EVENT.get(`/game-match/records/${params.gameType}?size=${params.size}&current=${params.current}`);
}
