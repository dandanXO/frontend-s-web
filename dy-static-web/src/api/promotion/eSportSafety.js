import { server } from "@/utils/request";

export function getUpcomingESportMatches() {
    return server.EVENT.get('/game-match/upcoming/ESPORT');
}