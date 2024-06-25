import { server } from "@/utils/request";

export function getReferralLink() {
  return server.REST.get("/session/member/referralCode");
}

export function getFriendList() {
  return server.REST.get("/session/referred");
}

export function getOneTimeBonus() {
  return server.REST.get("/session/refer-rebate/one-time-bonus-setting");
}
export function getMemberDetailAPI() {
  return server.REST.get("/session/refer-rebate/member-detail");
}
export function getLatestInviteesAPI() {
  return server.REST.get("/session/refer-rebate/latest-invitees");
}

export function getDownlinesAPI(paramString) {
  return server.REST.get(`/session/downlines?${paramString}`);
}

export function getDownlinePlatformSummaryAPI(paramString) {
  return server.REST.get(`/session/downline-platform-summary?${paramString}`);
}

export function getDownlineProfitSummaryAPI(paramString) {
  return server.REST.get(`/session/downline-profit-summary?${paramString}`);
}
