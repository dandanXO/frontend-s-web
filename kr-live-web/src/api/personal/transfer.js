import { server } from "@/utils/request";
const transferUrl = [
  "/session/balance/transfer/deposit",
  "/session/balance/transfer/withdraw",
];
export function transfer(type, ti) {
  return server.REST.post(transferUrl[type], ti);
}
export function getPlatforms() {
  return server.REST.get("/platform");
}
