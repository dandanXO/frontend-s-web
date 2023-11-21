import { server } from "@/utils/request";

export function getRecommendPrivilegeRecord(params) {
  return server.REST.post("/session/recommend/privilegeRecord", params)
}

export function getRebateInfo() {
  return server.EVENT.get("/refer-friend-rebate/info")
}