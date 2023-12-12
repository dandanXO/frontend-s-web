import { api, eventapi } from "boot/axios";

export function getRecommendPrivilegeRecord(params) {
  return api.post("/session/recommend/privilegeRecord", params)
}

export function getRebateInfo() {
  return eventapi.get("/refer-friend-rebate/info")
}