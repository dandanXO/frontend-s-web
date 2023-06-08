import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getSystemPaymentList = (systemPayment) => {
  return https().request("/system-payment", Method.GET, systemPayment, ContentType.form);
};

export const createSystemPayment = (systemPayment) => {
  return https().request("/system-payment", Method.POST, systemPayment, ContentType.json);
};

export const updateSystemPayment = (systemPayment) => {
  return https().request(`/system-payment/update?_method=PUT`, Method.POST, systemPayment, ContentType.json);
};

export const updateSystemPaymentStatus = async (id, status) => {
  await https().request(`/system-payment/${id}/status?_method=PUT`, Method.POST, { status: status }, ContentType.form);
};

export const getSystemPaymentById = (id) => {
  return https().request(`/system-payment/${id}/systemPayment`, Method.GET, {}, ContentType.form);
};

export const getSystemPaymentListForDeposit = (systemPayment) => {
  return https().request("/system-payment/depositRecord", Method.GET, systemPayment, ContentType.form);
};
