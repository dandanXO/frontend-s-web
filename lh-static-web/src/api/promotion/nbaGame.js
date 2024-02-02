import { server } from "@/utils/request";

export function loadNbaDetails(p) {
  return server.EVENT.get("/game-match/upcoming/NBA", p);
}

export function submitNBAInsuranceForm(params) {
  return server.EVENT.post('/game-match/submit', params);
}