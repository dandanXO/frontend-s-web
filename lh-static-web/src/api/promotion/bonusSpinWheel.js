import { server } from "@/utils/request";

export function getRecords() {
    return server.EVENT.get('/vipWheel/records');
}

export function getSpinWheelPrize() {
    return server.EVENT.post('/vipWheel/spin');
}

export function initSpinWheelData() {
    return server.EVENT.get('/vipWheel/init');
}