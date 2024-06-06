import { server } from "@/utils/request";

export function getJackpot() {
  return server.REST.get("/jackpotPrize/cq9");
}

export const getBetRanking = () => {
  return server.REST.get("/member/bet-ranking");
};
