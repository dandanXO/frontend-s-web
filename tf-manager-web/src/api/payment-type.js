import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getActivePaymentTypes = () => {
  return https().request("/paymentType/active", Method.GET);
};

export const getPaymentTypes = (paymentType) => {
  return https().request("/paymentType", Method.GET, paymentType, ContentType.form);
};

export const createPaymentType = (paymentType) => {
  return https().request("/paymentType", Method.POST, paymentType, ContentType.form);
};

export const updatePaymentType = async (paymentType) => {
  await https().request(`/paymentType/${paymentType.id}?_method=PUT`, Method.POST, paymentType, ContentType.form);
};

export const updatePaymentTypeStatus = (id, status) => {
  return https().request(`/paymentType/${id}/status?_method=PUT`, Method.POST, { status: status }, ContentType.form);
};

export const deletePaymentType = async (ids) => {
  await https().request(`/paymentType?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
