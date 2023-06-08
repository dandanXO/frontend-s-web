import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getPaymentBankList = (bank) => {
  return https().request("/system-payment-bank", Method.GET, bank, ContentType.form);
};

export const createPaymentBank = (bank) => {
  return https().request("/system-payment-bank", Method.POST, bank, ContentType.json);
};

export const deletePaymentBank = (id) => {
  return https().request(`/system-payment-bank/${id}`, Method.DELETE);
};
