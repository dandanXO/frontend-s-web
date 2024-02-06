import { server } from "@/utils/request";
const transferUrl = [
  "/session/balance/transfer/deposit",
  "/session/balance/transfer/withdraw",
];
export function transfer(type, ti) {
  return server.REST.post(transferUrl[type], ti);
}
export function withdrawAll(list) {
  return server.REST.post("/session/balance/transfer/withdrawAll", list);
}
export function getPlatforms() {
  return server.REST.get("/platform");
}

export function getLoggedInPlatformList() {
  return server.REST.get("/session/loggedInPlatform")
}

export function updateAutoTransferState(state) {
  return server.REST.put("/session/updateAutoTransferState/"+state);
};

export function getAutoTransferState() {
  return server.REST.get("/session/getAutoTransferState");
};
