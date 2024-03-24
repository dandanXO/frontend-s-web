import { server } from "@/utils/request";

export function getRecords() {
    return server.EVENT.get('/betWheel/records');
}

export function getSpinWheelPrize() {
    return server.EVENT.post('/betWheel/spin');
}


export function initSpinWheelData() {
    return server.EVENT.get('/betWheel/init');
}