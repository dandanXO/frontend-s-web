import { server } from "@/utils/request";

export function poolPrizeCastVote(params) {
  return server.EVENT.post("/privi/team-votes/vote", params);
}


export function poolPrizeVoteInit(params) {
    return server.EVENT.get("/privi/team-votes/init", params);
}