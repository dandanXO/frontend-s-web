import { server } from "@/utils/request";

export function getReferralLink() {
  return server.REST.get("/session/member/referralCode");
}

export function getInviteFriendListCount() {
  return server.REST.get(`/session/referred/count`, {});
}
export function getReferredBonus() {
  return server.REST.get(`session/referredBonus/count`, {});
}
export function getVNMReferred() {
  return server.REST.get('/session/vnm/newReferred')
}
