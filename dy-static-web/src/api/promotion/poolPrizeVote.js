import { server } from "@/utils/request";

export function poolPrizeVoteInit(params) {
    return server.EVENT.get("/privi/team-votes/init", params);
}