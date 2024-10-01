import { server } from "@/utils/request";

export function getJackpot() {
    return server.REST.get('/jackpotPrize/cq9');
}