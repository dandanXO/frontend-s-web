import { server } from "@/utils/request";

export function goldenEggInit(p) {
    return server.EVENT.get("/goldEgg/init", p);
}

export function goldenEggSubmit(p) {
    return server.EVENT.post("/goldEgg/submit", p);
}
