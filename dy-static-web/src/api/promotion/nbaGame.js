import { server } from "@/utils/request";

export function loadNbaDetails(p) {
  return server.EVENT.get("/game-match/upcoming", p);
}
