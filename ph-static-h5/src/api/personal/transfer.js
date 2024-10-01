import { api } from "src/boot/axios";
const transferUrl = ["/session/balance/transfer/deposit", "/session/balance/transfer/withdraw"];
export function transfer(type, ti) {
  return api.post(transferUrl[type], ti);
}
