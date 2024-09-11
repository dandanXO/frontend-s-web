import { server } from "@/utils/request";

export function getRecords() {
  return server.EVENT.get("/betWheel/records");
}

export function getSpinWheelPrize() {
  return server.EVENT.post("/betWheel/spin");
}

export function initSpinWheelData() {
  return server.EVENT.get("/betWheel/init");
}

export function getMidautumSpinWheelData() {
  return server.EVENT.get("/mooncakeFestSpin/init");
}

export function getMidautumSpinWheelPrize(times) {
  return server.EVENT.post(`/mooncakeFestSpin/spin?spinTimes=1`);
}

export function getMidautumSpinWheelRecords(params) {
  return server.EVENT.get("/mooncakeFestSpin/selectMemberSpinRecords", { params: params });
}
