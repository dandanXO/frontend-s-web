import { cashier } from "src/boot/axios";

export function loadPay() {
  return cashier.get(`/session/deposit/index/`);
}

export function loadPrivileges(paymentId) {
  return cashier.get(`/session/payment/${paymentId}/privileges`);
}

export function verifyAmount(paymentId, amount) {
  return cashier.get(
    `/session/payment/${paymentId}/amount/${amount}/verify`
  );
}

export function postDeposit(deposit) {
  return cashier.post("/session/payment/submit", deposit);
}
