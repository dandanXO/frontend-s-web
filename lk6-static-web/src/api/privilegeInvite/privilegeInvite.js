import { server } from "@/utils/request";

export function getRecommendPrivilegeRecord(params) {
  return server.EVENT.get("/refer-friend-rebate/record", {
    params
  });
}

export function getRebateInfo() {
  return server.EVENT.get("/refer-friend-rebate/info");
}
