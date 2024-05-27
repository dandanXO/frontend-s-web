import { server } from "@/utils/request";

export function getReferralLink() {
  return server.REST.get("/session/member/referralCode");
}

export function getFriendList() {
  return server.REST.get("/session/referred");
}