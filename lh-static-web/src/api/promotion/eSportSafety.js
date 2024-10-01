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

export function getUpcomingCopaMatches() {
  return server.EVENT.get("/game-match/upcoming/COPA");
}

export function getCopaPlatformOptions() {
  return server.EVENT.get("/game-match/platform/COPA");
}

export function submitCopaForm() {
  return server.EVENT.post("/game-match/submit/COPA", {});
}

export function submitUefaForm() {
  return server.EVENT.post("/game-match/submit/UEFA", {});
}

export function submitClaimForm(promoCode) {
  return server.EVENT.post(`/game-match/submit/${promoCode}`, {});
}

export function submitESportInsurance() {
  return server.EVENT.post("/game-match/submit/ESPORT");
}
export function getESportInsuranceRecords(params) {
  return server.EVENT.get(`/game-match/records/${params.gameType}?size=${params.size}&current=${params.current}`);
}
