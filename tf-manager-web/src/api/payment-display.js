import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getAllPayments = (data) => {
  return https().request("/system-payment/all", Method.GET, data, ContentType.form);
};

export const getPaymentShow = (data) => {
  return https().request("/system-payment/paymentShow", Method.GET, data, ContentType.form);
};

export const getPaymentShowDetails = (data) => {
  return https().request("/system-payment/paymentShow/details", Method.GET, data, ContentType.form);
};

export const copyPaymentShow = (nodes) => {
  return https().request("/system-payment/paymentShow/copy?_method=PUT", Method.POST, nodes, ContentType.json);
};

export const addPaymentShow = (nodes) => {
  return https().request("/system-payment/paymentShow/add?_method=PUT", Method.POST, nodes, ContentType.json);
};
export const updatePaymentShow = (nodes) => {
  return https().request("/system-payment/paymentShow/update?_method=PUT", Method.POST, nodes, ContentType.json);
};

export const updatePaymentShowDetails = (nodes) => {
  return https().request("/system-payment/paymentShow/details/update?_method=PUT", Method.POST, nodes, ContentType.json);
};

export const getSystemPaymentShowBySiteIdGroupByNodeName = (data) => {
  return https().request("/system-payment/showNoteById/", Method.GET, data, ContentType.form);
};

export const getPaymentDisplayList = (data) => {
  return https().request("/system-payment/sitepaymentdisplaylist/" + data, Method.GET);
};
