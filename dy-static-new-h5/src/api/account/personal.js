import { api } from "boot/axios"
import { cashier } from "boot/axios";

export function getReferralLink() {
  return api.get("/session/member/referralCode");
}

export function getParamKey(key) {
  return cashier.get(`/param/key/${key}`);
}
