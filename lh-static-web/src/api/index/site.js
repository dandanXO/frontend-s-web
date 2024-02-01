import { server } from "@/utils/request";
import cached from "@/utils/cache";

export function getSiteParamFromServer() {
  return server.REST.get("/menu");
}

export function getAppDownloadUrlFromServer() {
  return cached.get("APPDOWNLOAD_URL", () =>
    server.REST.get("/config/appDownloadUrl")
  );
}

export function getCSAFromServer() {
  return server.REST.get("/config/customerAddress");
}