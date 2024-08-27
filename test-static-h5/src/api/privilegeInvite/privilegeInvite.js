import { api, eventapi } from "boot/axios";

export function getRecommendPrivilegeRecord(params) {
  return eventapi.get("/refer-friend-rebate/record", {
    params
  });
}

export function getRebateInfo() {
  return eventapi.get("/refer-friend-rebate/info");
}
