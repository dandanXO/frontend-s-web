import { server } from "@/utils/request";

export function getEurocupManualSchedule() {
  return server.EVENT.get("/uefa/match/all");
}

