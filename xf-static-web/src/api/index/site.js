import { server } from "@/utils/request";

export function getSiteParamFromServer() {
  return server.REST.get("/menu");
}

export function getAppDownloadUrlFromServer() {
  return server.REST.get("/config/appDownloadUrl");
}

export function getCSAFromServer() {
  return server.REST.get("/config/customerAddress");
}
