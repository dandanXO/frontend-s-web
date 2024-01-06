import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const loadPay = () => {
  return https('cashier').request(`/session/deposit/index`, Method.GET);
}

export const loadPrivileges = (paymentId) => {
  return https('cashier').request(`/session/payment/${paymentId}/privileges`, Method.GET);
}

export const verifyAmount = (paymentId, amount) => {
  return https('cashier').request(`/session/payment/${paymentId}/amount/${amount}/verify`, Method.GET);
}

export const postDeposit = (deposit) => {
  return https('cashier').request(`/session/payment/submit`, Method.POST, deposit, ContentType.form);
}

export const loadBankCards = () => {
  return https('affiliate').request(`/session/bankCard`, Method.GET);
}
