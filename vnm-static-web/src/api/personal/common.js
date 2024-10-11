import { server } from "@/utils/request";

export function getParamKey(key) {
  return server.CASHIER.get(`/param/key/${key}`);
}

export function getAnnouncement() {
  return server.REST.get(`/announcement`);
}

export function getSitePopoutList(type) {
  return server.REST.get(`/member/site-popout-list?siteType=${type}`);
}
