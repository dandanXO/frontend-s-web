import { server } from "@/utils/request";

export function receiveLuckydrawBonus() {
    return server.EVENT.get('/receiveLuckydrawBonus');
}