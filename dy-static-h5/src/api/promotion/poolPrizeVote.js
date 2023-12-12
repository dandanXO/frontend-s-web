import { eventapi } from "boot/axios";

export function poolPrizeCastVote(params) {
    return eventapi.post("/privi/team-votes/vote", params);
  }
  
  
export function poolPrizeVoteInit(params) {
    return eventapi.get("/privi/team-votes/init", params);
};