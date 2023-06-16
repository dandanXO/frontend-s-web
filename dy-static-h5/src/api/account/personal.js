import { api } from "boot/axios"

export function getReferralLink() {
  return api.get("/session/member/referralCode");
}
