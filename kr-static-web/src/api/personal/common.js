import { server } from "@/utils/request";

export function getParamKey(key) {
  return server.CASHIER.get(`/param/key/${key}`);
}

export function getAnnouncement() {
  return server.REST.get(`/announcement`);
}

export function getFinanceRecords() {
  return server.REST.get(`/member/withdraw-deposit-record`);
}