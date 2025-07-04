import { eventapi } from "boot/axios";

export function poolPrizeCastVote(params) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.post(`/privi/team-votes/vote?v=${randNum}`, params);
}

export function poolPrizeVoteInit(params) {
  const randNum = Math.floor(Math.random() * 1000) + 1;
  return eventapi.get(`/privi/team-votes/init?v=${randNum}`, params);
}
