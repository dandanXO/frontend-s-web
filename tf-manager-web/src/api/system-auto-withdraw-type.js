import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getSystemAutoPaymentTypeList = (systemAutoPaymentType) => {
  return https().request("/system-auto-withdraw", Method.GET, systemAutoPaymentType, ContentType.form);
};

export const createSystemAutoPaymentType = (systemAutoPaymentType) => {
  return https().request(`/system-auto-withdraw`, Method.POST, systemAutoPaymentType, ContentType.form);
};

export const createSystemAutoPaymentPlaltform = (systemAutoPaymentType) => {
  return https().request(`/system-auto-withdraw/createPlatform`, Method.POST, systemAutoPaymentType, ContentType.form);
};

export const updateystemAutoPaymentType = (systemAutoPaymentType) => {
  return https().request(`/system-auto-withdraw/update?_method=PUT`, Method.POST, systemAutoPaymentType, ContentType.form);
};

export const disableSystemAutoPaymentTypeBySite = (systemAutoPaymentType) => {
  return https().request(`/system-auto-withdraw/disableAll?_method=PUT`, Method.POST, systemAutoPaymentType, ContentType.form);
};

export const updateSystemAutoPaymentPlaltform = (systemAutoPaymentType) => {
  return https().request(`/system-auto-withdraw/updatePlatform?_method=PUT`, Method.POST, systemAutoPaymentType, ContentType.form);
};

export const deleteSystemAutoPaymentPlaltform = (systemAutoPaymentType) => {
  return https().request(`/system-auto-withdraw/delete?_method=DELETE`, Method.POST, systemAutoPaymentType, ContentType.form);
};
