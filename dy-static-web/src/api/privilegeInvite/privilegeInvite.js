import { server } from "@/utils/request";

export function getRecommendPrivilegeRecord(params) {
    return server.REST.post("/session/recommend/privilegeRecord", params)
  }