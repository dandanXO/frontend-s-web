import { server } from "@/utils/request";

export function loadPay() {
  return server.CASHIER.get("/session/deposit/index/");
}

export function loadPrivileges(paymentId) {
  return server.CASHIER.get(`/session/payment/${paymentId}/privileges`);
}

export function verifyAmount(paymentId, amount) {
  return server.CASHIER.get(`/session/payment/${paymentId}/amount/${amount}/verify`);
}

export function postDeposit(deposit) {
  return server.CASHIER.post("/session/payment/submit", deposit);
}
