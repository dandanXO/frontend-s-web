import { server } from "@/utils/request";
import cached from "@/utils/cache";

export function getSiteParamFromServer() {
  return server.REST.get("/menu");
}

export function getAppDownloadUrlFromServer() {
  return cached.get("APPDOWNLOAD_URL", () => server.REST.get("/app/getAppData?siteCode=vnm&appType=ALL_SITE"));
}

export function getCSAFromServer() {
  return server.REST.get("/config/customerAddress/v2");
}

export function getRedEnvelopeFromServer() {
  return server.EVENT.get("/redPacketVip/nextRainTime?promoCode=OP_SPE_quockhanh2/9_2888VNDP_1VC_082024");
}

export function getFloatingItems() {
  return server.REST.get("/redirect");
}

export function submitMemberStats(stats) {
  return server.REST.post("/memberStatistics/submit", stats);
}
