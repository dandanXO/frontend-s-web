import { server } from "@/utils/request";

export function tigerCardInit(p) {
    return server.EVENT.post("/tigerCard/init", p);
}

export function getLeaderboard() {
    return server.EVENT.post("/tigerCard/getLeaderboard");
}

export function getMemberCard(p) {
    return server.EVENT.post("/tigerCard/getMemberCard", p);
}

export function giveCardToFriend(p) {
    return server.EVENT.post("/tigerCard/giveCardToFriend", p);
}

export function synthesisCard(p) {
    return server.EVENT.post("/tigerCard/synthesisCard", p);
}
